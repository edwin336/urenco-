# Gym log

A static web app for logging planned sessions. No build step, no dependencies.

Run it: `cd gym && python3 -m http.server 8000`, then open http://localhost:8000.
On an iPad, open the hosted URL in Safari and use Share > Add to Home Screen.

Add a workout by appending an object to `WORKOUTS` in `workouts.js`. The format is
described at the top of that file. Data is stored in the browser (localStorage).
