param(
    [Parameter(Mandatory = $true)][string]$Event
)

$ErrorActionPreference = 'Stop'

$inputReader = [System.IO.StreamReader]::new(
    [System.Console]::OpenStandardInput(),
    [System.Text.Encoding]::UTF8,
    $true
)
$inputJson = $inputReader.ReadToEnd()
$inputReader.Dispose()
if ([string]::IsNullOrWhiteSpace($inputJson)) {
    throw 'The Copilot hook did not provide its JSON input on stdin.'
}

$hook = $inputJson | ConvertFrom-Json
$repoRoot = Split-Path -Parent $PSScriptRoot
$logDirectory = Join-Path $repoRoot '.agent-logs'
$pendingDirectory = Join-Path $logDirectory '.pending'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Get-HookValue {
    param(
        [Parameter(Mandatory = $true)][AllowNull()]$Object,
        [Parameter(Mandatory = $true)][string[]]$Names
    )

    foreach ($name in $Names) {
        $property = $Object.PSObject.Properties[$name]
        if ($null -ne $property) {
            return $property.Value
        }
    }

    return $null
}

function Convert-HookTimestampToUtc {
    param([Parameter(Mandatory = $true)]$Value)

    if ($Value -is [string]) {
        $parsed = [DateTimeOffset]::MinValue
        if ([DateTimeOffset]::TryParse($Value, [ref]$parsed)) {
            return $parsed.ToUniversalTime()
        }
    }
    elseif ($Value -is [ValueType]) {
        return [DateTimeOffset]::FromUnixTimeMilliseconds([long][Math]::Round([double]$Value))
    }

    throw "Unsupported Copilot hook timestamp: $Value"
}

function Get-EventText {
    param([Parameter(Mandatory = $true)]$Event)

    $data = Get-HookValue $Event @('data')
    $content = Get-HookValue $data @('content')
    if ($null -eq $content) {
        $content = Get-HookValue $Event @('content')
    }
    if ($content -is [string]) {
        return $content
    }
    if ($content -is [System.Collections.IEnumerable]) {
        $parts = New-Object System.Collections.Generic.List[string]
        foreach ($part in $content) {
            $text = Get-HookValue $part @('text')
            if ($null -ne $text) {
                $parts.Add([string]$text)
            }
        }
        if ($parts.Count -gt 0) {
            return [string]::Join('', $parts)
        }
    }
    return $null
}

if (-not (Test-Path -LiteralPath $logDirectory)) {
    New-Item -ItemType Directory -Path $logDirectory | Out-Null
}
if (-not (Test-Path -LiteralPath $pendingDirectory)) {
    New-Item -ItemType Directory -Path $pendingDirectory | Out-Null
}

$eventName = $Event
$sessionId = [string](Get-HookValue $hook @('sessionId', 'session_id'))
$timestampValue = Get-HookValue $hook @('timestamp')
if ([string]::IsNullOrWhiteSpace($eventName) -or [string]::IsNullOrWhiteSpace($sessionId)) {
    throw 'Copilot hook input is missing its event name or session ID.'
}

$sessionFilePart = $sessionId -replace '[^A-Za-z0-9._-]', '_'
$pendingPath = Join-Path $pendingDirectory ($sessionFilePart + '.json')
$model = [string]$env:CAPTURE_MODEL
if ([string]::IsNullOrWhiteSpace($model)) {
    $model = 'not provided by hook'
}
$author = [string]$env:CAPTURE_AUTHOR
if ([string]::IsNullOrWhiteSpace($author)) {
    $author = 'unknown'
}

switch -Regex ($eventName) {
    '^(userPromptSubmitted|UserPromptSubmit)$' {
        $prompt = Get-HookValue $hook @('prompt')
        if ($null -eq $prompt) {
            throw 'The Copilot prompt hook did not include the submitted prompt.'
        }

        $promptTime = Convert-HookTimestampToUtc $timestampValue
        $promptTimestamp = $promptTime.ToString("yyyy-MM-ddTHH:mm:ss.fff'Z'")
        if (Test-Path -LiteralPath $pendingPath) {
            throw "A previous prompt for session $sessionId has no matching agentStop capture."
        }

        $logPath = $null
        $entryNumber = 1
        $existingLog = Get-ChildItem -LiteralPath $logDirectory -Filter ('*_' + $sessionFilePart + '.md') -File |
            Select-Object -First 1
        if ($null -ne $existingLog) {
            $logPath = $existingLog.FullName
            $entryNumber = ([regex]::Matches([System.IO.File]::ReadAllText($logPath), '\[LOG_ENTRY type=PROMPT ')).Count + 1
            $logText = [System.IO.File]::ReadAllText($logPath)
            $logText = ([regex]::new('(?m)^last_prompt_time: .+\r?$')).Replace(
                $logText,
                "last_prompt_time: $promptTimestamp",
                1
            )
            [System.IO.File]::WriteAllText($logPath, $logText, $utf8)
        }
        else {
            $fileName = $promptTime.ToString('yyyy-MM-dd_HH-mm-ss') + '_' + $sessionFilePart + '.md'
            $logPath = Join-Path $logDirectory $fileName
            $project = Split-Path -Leaf $repoRoot
            $header = @"
---
session_id: $sessionId
date: $($promptTime.ToString('yyyy-MM-dd'))
author: $author
model: $model
tool: vscode-copilot-sdk
project: $project
total_exchanges: 0
first_prompt_time: $promptTimestamp
last_prompt_time: $promptTimestamp
---

# Session Log - $($promptTime.ToString('yyyy-MM-dd'))

Session: ``$($sessionId.Substring(0, [Math]::Min(8, $sessionId.Length)))`` | Project: ``$project`` | Author: ``$author``

---

"@
            [System.IO.File]::WriteAllText($logPath, $header, $utf8)
        }

        $shortSessionId = $sessionId.Substring(0, [Math]::Min(8, $sessionId.Length))
        $promptEntry = @"
[LOG_ENTRY type=PROMPT num=$entryNumber session=$shortSessionId]
timestamp: $promptTimestamp
model: $model

$prompt


"@
        [System.IO.File]::AppendAllText($logPath, $promptEntry, $utf8)
        $pending = [ordered]@{
            logPath = $logPath
            entryNumber = $entryNumber
            sessionId = $sessionId
            shortSessionId = $shortSessionId
            timestamp = $promptTimestamp
            model = $model
        } | ConvertTo-Json
        [System.IO.File]::WriteAllText($pendingPath, $pending, $utf8)
        break
    }

    '^(agentStop|Stop)$' {
        if (-not (Test-Path -LiteralPath $pendingPath)) {
            throw "No captured prompt is pending for session $sessionId."
        }

        $pending = Get-Content -LiteralPath $pendingPath -Raw | ConvertFrom-Json
        $transcriptPath = [string](Get-HookValue $hook @('transcriptPath', 'transcript_path'))
        if ([string]::IsNullOrWhiteSpace($transcriptPath) -or -not (Test-Path -LiteralPath $transcriptPath -PathType Leaf)) {
            throw 'The Copilot stop hook did not provide a readable transcript path.'
        }

        $response = $null
        $responseModel = $null
        foreach ($line in [System.IO.File]::ReadLines($transcriptPath)) {
            if ([string]::IsNullOrWhiteSpace($line)) {
                continue
            }
            $record = $line | ConvertFrom-Json
            $recordType = [string](Get-HookValue $record @('type', 'eventType', 'event_type', 'event'))
            if ($recordType -eq 'assistant.message') {
                $response = Get-EventText $record
                $data = Get-HookValue $record @('data')
                $responseModel = Get-HookValue $data @('model')
                if ($null -eq $responseModel) {
                    $responseModel = Get-HookValue $record @('model')
                }
            }
        }
        if ($null -eq $response) {
            throw "No final assistant.message was found in the session transcript: $transcriptPath"
        }

        $modelToLog = [string]$responseModel
        if ([string]::IsNullOrWhiteSpace($modelToLog)) {
            $modelToLog = [string]$pending.model
        }
        $stopTime = Convert-HookTimestampToUtc $timestampValue
        $responseTimestamp = $stopTime.ToString("yyyy-MM-ddTHH:mm:ss.fff'Z'")
        $responseEntry = @"
[LOG_ENTRY type=RESPONSE num=$($pending.entryNumber) session=$($pending.shortSessionId)]
timestamp: $responseTimestamp
model: $modelToLog

$response


"@
        [System.IO.File]::AppendAllText([string]$pending.logPath, $responseEntry, $utf8)

        $logText = [System.IO.File]::ReadAllText([string]$pending.logPath)
        $completedExchanges = ([regex]::Matches($logText, '\[LOG_ENTRY type=RESPONSE ')).Count
        $logText = ([regex]::new('(?m)^total_exchanges: \d+\r?$')).Replace(
            $logText,
            "total_exchanges: $completedExchanges",
            1
        )
        [System.IO.File]::WriteAllText([string]$pending.logPath, $logText, $utf8)
        Remove-Item -LiteralPath $pendingPath
        break
    }

    default {
        throw "Unsupported Copilot hook event: $eventName"
    }
}
