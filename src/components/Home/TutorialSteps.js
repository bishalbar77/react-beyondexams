export const TutorialSteps = [
  {
    element: '[data-tut="browse"]',
    intro: "<span>😊</span><p>Click here to choose from our existing learning journeys (Courses)</p>",
  },
  {
    element: '[data-tut="search"]',
    intro: "<span>🔍</span>Want to learn something new? It's as easy as searching for it!",
    tooltipClass: "myTooltipClass customTooltipClass",
  },
  //customTooltipClass
  // localStorage.getItem("access_token")
  //   ? {
  //       element: '[data-tut="dashboard"]',
  //       intro: `Click on "dashboard" to start your learning journey in one click!`,
  //     }
  //   : {
  //       element: '[data-tut="login"]',
  //       intro: `To get more personalised results, Login using your Google account!`,
  //     },
];

export const CreateCourseMobile = [
  {
    element: '[data-tut="browse"]',
    intro: `<span>😄</span>Click here to go to courses section`,
    tooltipClass: "tour-tool-tip myTooltipClass",
  },
  //finalStep
  {
    element: '[data-tut="search"]',
    intro: "Want to learn something new? It's as easy as searching for it!",
  },
];
export const CreateCourse = [
  {
    element: '[data-tut="dashboard"]',
    intro: `<span>😄</span>Click here to go to courses section`,
    tooltipClass: "tour-tool-tip myTooltipClass",
  },
  {
    element: '[data-tut="search"]',
    intro: "Want to learn something new? It's as easy as searching for it!",
  },
];
