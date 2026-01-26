# a789b1dc:packages_plugin-bootstrap_src_providers_roles.ts:151-203

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/roles.ts:151-203
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    }

    // Format the response
    let response = '# Server Role Hierarchy\n\n';

    if (owners.length > 0) {
      response += '## Owners\n';
      owners.forEach((owner) => {
        response += `${owner.name} (${owner.names.join(', ')})\n`;
      });
      response += '\n';
    }

    if (admins.length > 0) {
      response += '## Administrators\n';
      admins.forEach((admin) => {
        response += `${admin.name} (${admin.names.join(', ')}) (${admin.username})\n`;
      });
      response += '\n';
    }

    if (members.length > 0) {
      response += '## Members\n';
      members.forEach((member) => {
        response += `${member.name} (${member.names.join(', ')}) (${member.username})\n`;
      });
    }

    if (owners.length === 0 && admins.length === 0 && members.length === 0) {
      return {
        data: {
          roles: [],
        },
        values: {
          roles: 'No role information available for this server.',
        },
        text: 'No role information available for this server.',
      };
    }

    return {
      data: {
        roles: response,
      },
      values: {
        roles: response,
      },
      text: response,
    };
  },
};

export default roleProvider;
```