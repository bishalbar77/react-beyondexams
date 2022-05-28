let subDomain = window.location.host.split(".")[0];
const baseDomain = {
  route: "https://api.beyondexams.org",
  subRoute: subDomain === "morethanmarks" ? `/api/v1/${subDomain}` : "/api/v1",
};

export default baseDomain;
