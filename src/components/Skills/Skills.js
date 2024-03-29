import styles from "./Skills.module.css";
import React, { useEffect, useState } from "react";
import {
  FaHtml5,
  FaCss3,
  FaBootstrap,
  FaPython,
  FaGit,
  FaGithub,
} from "react-icons/fa";
import {
  SiJavascript,
  SiJquery,
  SiFlask,
  SiPostgresql,
  SiReact,
  SiTypescript,
  SiMongodb,
  SiFirebase,
} from "react-icons/si";
import nextJSIcon from "../../assets/images/StackImages/nextjsicon.png";
import FadeInSection from "../Fade/FadeInSection";

const Skills = (props) => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main id={props.id} className={styles.container}>
      <div className={styles["main-content"]}>
          <h3>Skills</h3>
        <FadeInSection>
          <p className={styles.subheader}>
            While I mainly specialize in React and Python, I've been working on
            adding more skills to my toolkit.
          </p>
          <div className={styles["skills-container"]}>
            <div className={styles.skills}>
              {/* Column 1 */}
              <div className={styles.col}>
                <span style={{ color: "#E34F26" }}>
                  <FaHtml5 size={40} />
                  <p>HTML5</p>
                </span>
                <span style={{ color: "#2965f1" }}>
                  <FaCss3 size={40} />
                  <p>CSS3</p>
                </span>
                <span style={{ color: "#F7DF1E" }}>
                  <SiJavascript size={40} />
                  <p>Javascript</p>
                </span>
                <span style={{ color: "#7411F6" }}>
                  <FaBootstrap size={40} />
                  <p>Bootstrap</p>
                </span>
                {width <= 800 && <span style={{ color: "yellow" }}>
                      <SiFirebase size={40} />
                      <p>Firebase</p>
                    </span>}
              </div>
              {/* Column 2 */}
              <div className={styles.col}>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="0"
                    height="0"
                  >
                    <linearGradient id="g1" x2="50%" y2="50%">
                      <stop offset="1" stopColor="rgba(53,108,155,1)" />
                      <stop offset="1" stopColor="rgba(247,204,66,1)" />
                    </linearGradient>
                  </svg>

                  <FaPython
                    size={40}
                    className={styles["python-icon"]}
                    style={{ fill: "url(#g1)" }}
                  />
                  <p>Python</p>
                </span>
                <span style={{ color: "#FFF" }}>
                  <SiFlask size={40} />
                  <p>Flask</p>
                </span>
                <div className={styles.middle}>
                  <span style={{ color: "#1169AE" }}>
                    <SiJquery size={40} />
                    <p>Jquery</p>
                  </span>
                 {width >= 800 && <><span style={{ color: "#31648C" }}>
                    <SiPostgresql size={40} />
                    <p>PostgreSQL</p>
                  </span><span style={{ color: "yellow" }}>
                      <SiFirebase size={40} />
                      <p>Firebase</p>
                    </span></>}
                </div>
                <span style={{ color: "#FFF" }}>
                  <FaGithub size={40} />
                  <p>Github</p>
                </span>
                <span style={{ color: "#EE2C39" }}>
                  <FaGit size={40} />
                  <p>Git</p>
                </span>
              </div>

              {/* Column 3 */}
              <div className={styles.col}>
                <span style={{ color: "#61DBFB" }}>
                  <SiReact size={40} />
                  <p>React</p>
                </span>
                <span style={{ color: "#2F74C0" }}>
                  <SiTypescript size={40} />
                  <p>Typescript</p>
                </span>
                <span style={{ color: "#429543" }}>
                  <SiMongodb size={40} />
                  <p>MongoDB</p>
                </span>
                <span style={{ color: "#E34F26" }}>
                  <img src={nextJSIcon} />
                  <p>NextJS</p>
                </span>
                {width <= 800 && <span style={{ color: "#31648C" }}>
                    <SiPostgresql size={40} />
                    <p>PostgreSQL</p>
                  </span>}
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </main>
  );
};

export default Skills;
