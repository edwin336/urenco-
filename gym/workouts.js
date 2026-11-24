// Add new sessions to this array. Nothing else needs to change.
//
// session: { id, title, subtitle, blocks: [...] }
// block:   { title, optional?, notes?: [string], score?: true, items: [...] }
// item:    { name, sets?, reps?, rpe?, rest? }   -> logged set by set
//          { text }                               -> plain line (warm-ups, circuits)
//
// rest is in seconds. Keep ids unique and stable: logged data is saved under them.

const WORKOUTS = [
  {
    id: "lower-1",
    title: "Lower body",
    subtitle: "Quad focus",
    blocks: [
      {
        title: "Warm up",
        items: [
          { text: "3:00-5:00 cardio machine @ moderate effort" },
          { text: "Then 2-3 sets of:" },
          { text: "20 forward lunges" },
          { text: "10/10 Cossack squat" },
          { text: "10/10 single leg RDL" },
          { text: "Rest 1:00 between sets" },
        ],
      },
      {
        title: "Primary focus",
        items: [{ name: "Back squat", sets: 4, reps: "6-8", rpe: 7, rest: 120 }],
        notes: [
          "Written as back squat because it's what most people will have access to. If you have a leg press, hack squat, pendulum squat or belt squat, those are preferred. They let you load the quads without loading the spine as much. Machines take away the need to balance, which helps when you're trying to connect with a muscle as much as possible.",
          "Your focus should be FEELING the quads.",
        ],
      },
      {
        title: "Superset",
        items: [
          { name: "Goblet squat", sets: 3, reps: "15" },
          { name: "Jumping air squat", sets: 3, reps: "15-20", rest: 120 },
        ],
        notes: [
          "If you had trouble connecting with your quads all day, you surely won't have an issue here.",
          "Use a weight that feels like you could do twenty reps on the goblet squat, then go right into your jumping air squats with no rest. You don't need to be jumping through the roof, just come off your feet or even onto your toes on each rep.",
        ],
      },
      {
        // The title and any exercises above these two were not in the screenshots.
        title: "Lunges and hinges",
        items: [
          { name: "Walking lunge", sets: 3, reps: "8-12", rpe: 8, rest: 120 },
          { name: "Dumbbell RDL", sets: 3, reps: "8-10", rpe: 9, rest: 120 },
        ],
        notes: [
          "You may do these as walking lunges or lunges in place. If you do not have a convenient set up for back rack barbell lunges, you can weight these however you'd like.",
          "Don't focus on how many reps you feel you could do; instead, focus on feeling your glutes and quads work on each rep.",
          "Use any sort of hamstring curl machine if you have access to one.",
          "As with all bodybuilding work, connecting with the muscle and performing the movement with a full range of motion is more important than the weight you use.",
        ],
      },
    ],
  },
  {
    id: "upper-1",
    title: "Upper body",
    subtitle: "Chest, shoulders, triceps",
    blocks: [
      {
        title: "Warm up",
        items: [
          { text: "3:00-5:00 cardio machine @ moderate effort" },
          { text: "Then 2-3 sets of:" },
          { text: "10/10 rotating posterior dumbbell press" },
          { text: "10/10 rotating anterior dumbbell press" },
          { text: "10/10 pec stretch on rig" },
          { text: "10/10 trap stretch on rig" },
          { text: "Rest 1:00 between sets" },
        ],
      },
      {
        title: "Primary focus",
        items: [{ name: "Incline dumbbell bench press", sets: 4, reps: "6-8", rpe: 9, rest: 180 }],
        notes: [
          "Aim to use a weight that is challenging but feels like you could do 3 more reps with it.",
          "If you normally don't rest much, try resting up to three minutes today. You will find that you're able to repeat weights/reps that you normally couldn't.",
          "There is no specific tempo this week. Just move with control and intent.",
        ],
      },
      {
        title: "The good stuff",
        items: [
          { name: "Machine chest press", sets: 3, reps: "10-12", rpe: 9, rest: 120 },
          { name: "Dumbbell delt fly", sets: 3, reps: "15-20", rpe: 7, rest: 90 },
          { name: "Behind the neck dumbbell tricep extension", sets: 3, reps: "12-15", rpe: 10, rest: 60 },
        ],
        notes: [
          "Start at the low end of the rep range, add reps each week until you reach the top with clean form, then increase the weight and drop back to the bottom to climb again.",
          "If you do not have access to a machine, you may do flat dumbbell bench, dumbbell floor press, bench press, or dumbbell flys.",
          "Take each set close to failure. It should feel like you could perform two more reps on each set.",
          "It's okay if there is fall off from set to set. For example, your three sets may look like 12, 10, 9 reps. This means you are really connecting with the muscle, which is good.",
        ],
      },
      {
        title: "Finisher",
        optional: true,
        score: true,
        items: [
          { text: "AMRAP 9:00" },
          { text: "9-12-15-18-21 push up" },
          { text: "6-9-12-15-18 ski erg" },
        ],
        notes: [
          "This is completely optional for those who want to do a metcon-style finisher.",
          "The intent of this is to get a HUGE PUMP while being a bit out of breath. It should not be wildly intense.",
          "Add three reps to both movements on each new round.",
        ],
      },
    ],
  },
];
