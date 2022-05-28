import React from "react";
import ReactDOM from "react-dom";
import Routes from "./components/routes.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { createTheme, MuiThemeProvider, responsiveFontSizes } from "@material-ui/core/styles";
// import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
// import { getLocal } from "./components/common/localStorageAccess";
// import { register } from "./serviceWorker";

// const instance = createInstance({
//   urlBase: "https://beyondexams.matomo.cloud/",
//   siteId: 1,
//   userId: getLocal("name") || null,
//   linkTracking: false,
// });

const theme = responsiveFontSizes(
  createTheme({
    typography: { fontFamily: `"Poppins", sans-serif` },
    palette: {
      primary: {
        main: "#6646e7",
      },
    },
  })
);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        {/* <MatomoProvider value={instance}> */}
        <Routes />
        {/* </MatomoProvider> */}
      </MuiThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// register();
