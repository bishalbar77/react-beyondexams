import React, { useEffect } from "react";
import { useTransition, animated } from "react-spring";
import LoginIllustration from "../../../assets/images/icons/login-illustration.svg";
import LoginTeacher from "../../../assets/images/icons/login-teacher.svg";
import LoginParents from "../../../assets/images/icons/login-parents.svg";
import LoginPencil from "../../../assets/images/icons/login-pencil.svg";
import LoginParachute from "../../../assets/images/icons/login-parachute.svg";
import LoginPlant from "../../../assets/images/icons/login-plant.svg";

const pages = [
  ({ style }) => (
    <animated.div style={{ ...style }}>
      <>
        <img className="login-illus-one-student" src={LoginIllustration} alt="" />
        <img className="login-illus-two" src={LoginPencil} alt="" />
      </>
    </animated.div>
  ),
  ({ style }) => (
    <animated.div style={{ ...style }}>
      <img className="login-illus-one-teacher" src={LoginTeacher} alt="" />
      <img className="login-illus-two" src={LoginParachute} alt="" />
    </animated.div>
  ),
  ({ style }) => (
    <animated.div style={{ ...style }}>
      <img className="login-illus-one-parent" src={LoginParents} alt="" />
      <img className="login-illus-two" src={LoginPlant} alt="" />
    </animated.div>
  ),
];

export default function Animated(props) {
  //   const [index, set] = useState(0);
  //   const onClick = useCallback((a) => {
  //     console.log(a);
  //     set((state) => (state + 1) % 3);
  //   }, []);
  useEffect(() => {
    document.body.classList.add("animation");
    return function cleanup() {
      document.body.classList.remove("animation");
    };
  });
  const transitions = useTransition(props.index, (p) => p, {
    from: { opacity: 0, transform: "translate3d(0,100%,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-50%,0)" },
    intial: null,
  });
  return (
    <div className="simple-trans-main">
      {transitions.map(({ item, props, key }) => {
        const Page = pages[item];
        return <Page key={key} style={props} />;
      })}
    </div>
  );
}
