import React, { useState } from "react";
import Footer from "../../common/Footer";
import styles from "./Testimonials.module.css";
import Carousel from "react-material-ui-carousel";
import testimonialsData from "./testimonials.json";
import IframeResizer from 'iframe-resizer-react';

function Testimonials()
{
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <div className={styles.testimonialsContainer}>
        <div className={styles.topContainer}>
          <p className={styles.subHeading}>Testimonials</p>

          <h2 className={styles.heading}>
            What our <span className={styles.highlight}> students say? </span>{" "}
          </h2>
        </div>

        <div className={styles.videoTestimonials}>
          <Carousel
            animation="slide"
            indicators={false}
            timeout={500}
            navButtonsAlwaysVisible={true}
            autoPlay={false}
            swipe={true}
            navButtonsProps={{
              style: {
                backgroundColor: "#FFF",
                color: "#6646e7",
              },
            }}
            navButtonsWrapperProps={{
              buttonWrapper: {
                display: "none !important",
              },
            }}
            onChange={() =>
            {
              setIsPlaying(false);
            }}
          >
            {testimonialsData.videoTestimonials.map((video) => (
              <div className={styles.videoItem}>
                <video
                  className={styles.video}
                  onClick={(e) =>
                  {
                    if (isPlaying)
                    {
                      e.target.pause();
                      setIsPlaying(false);
                    } else
                    {
                      e.target.play();
                      setIsPlaying(true);
                    }
                  }}
                >
                  <source src={video.video_url} type="video/mp4" />
                </video>

                <div className={styles.videoUserDiv}>
                  <div className={styles.hr}></div>
                  <p className={styles.videoUser}>{video.user}</p>
                  <div className={styles.hr}></div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className={styles.imageTestimonials}>

          {
            testimonialsData.imageTestimonials.map(image => (
              <img src={image} alt="testimonial" className={styles.imgTestimonial} />
            ))
          }

        </div>

        <div className={styles.tweetTestimonials}>
          <IframeResizer
            src="https://embed.testimonial.to/w/beyondexams-testimonials?theme=light&card=base"
            style={{ border: "none", width: "100%", height: "100%" }}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Testimonials;
