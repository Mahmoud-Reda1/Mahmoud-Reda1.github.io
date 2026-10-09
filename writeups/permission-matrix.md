Access control bugs live in a gap: the gap between what a product says each role can do and what the server actually lets each role do. The fastest way I know to find that gap is to stop guessing and draw a table.

## Read the rules before the app

Before I create a single account, I read the program's scope and exclusions, and I check which program owns each host. A real finding on a host that belongs to a different program, or in a category the program excludes, earns nothing. Ten minutes here saves days later.

## Let the product write the test cases

Many products document their roles. A page that says *"Editors can create projects but cannot manage billing"* is really a list of test cases. Every **cannot** in the documentation is a claim I can check.

## Build the matrix

I create one account for each role, plus a second organization to test isolation between tenants. Then I draw the table: roles down the side, actions across the top, and the expected result in every cell, written down before the first request.

| Role | View | Edit | Delete | Invite |
|---|---|---|---|---|
| Admin | Allowed | Allowed | Allowed | Allowed |
| Editor | Allowed | Allowed | Allowed | Denied |
| Viewer | Allowed | Denied | Denied | Denied |

## Fill it from the server, not the screen

For each action, I capture the request as the highest role, then replay it with the session of each lower role:

```http
DELETE /api/projects/42 HTTP/2
Host: app.example.com
Authorization: Bearer <viewer token>
```

A button that disappears from the interface proves nothing, because the interface is not the security boundary. What matters is what the server does. And a `200 OK` is not the end either: I reload as the owner and check whether the project is really gone. A change in the server's state is the finding. A status code is only a hint.

## Show the contrast

When a cell is wrong, I look at its neighbours. Is the same action denied in the web interface but allowed through the API? Denied for one type of object but allowed for another? Showing where the rule holds makes it obvious where it breaks, and it makes the report hard to dismiss.

## Report what is real

The report gets the expected-versus-actual table, the shortest reproduction steps I can write, and an impact statement from a realistic attacker's position: a lower-privileged member of the same organization, or a user in another one. Then I rate the severity the way a skeptical triager would, not the way I hope it will be rated.

The table takes an hour to build. It turns access control testing from a hunch into a checklist, and it is the reason a single wrong cell is hard to miss.
