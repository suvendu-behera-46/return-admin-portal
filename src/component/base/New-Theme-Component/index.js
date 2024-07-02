import React from "react";

const NewTheme = () => {
  return (
    <div className="theme-container">
      <div style={{ padding: 15 }} className="scrollable-box">
        <p>
          Written instructions on how to install code for product page in 2.0
          theme
        </p>
        <div
          className="row"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          <span>If you have 2.0 theme please open the</span>
          <button
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              marginInline: 5,
              cursor: "pointer",
            }}
          >
            Theme Editor
          </button>
          <span>to setup the app.</span>
        </div>
        {/* Lists */}
        <ul style={{ marginLeft: 15 }}>
          <li>
            <span>Please open</span>
            <button
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
                marginInline: 5,
                cursor: "pointer",
              }}
            >
              Theme Editor
            </button>
            <span>
              and select product page as shown in{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                screenshot.
              </span>
            </span>
          </li>
          <li>
            <span>
              Please click on add block and add your product widget.Please check
              the{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                screenshot.
              </span>
            </span>
          </li>
          <li>
            <span>
              Once widget is added you can drag and drop the widget and save it.
              Please check the{" "}
              <span
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                screenshot.
              </span>
            </span>
          </li>
        </ul>
        <span>
          Please check this
          <span
            style={{
              textDecoration: "underline",
              color: "blue",
              cursor: "pointer",
              marginInline: 3,
            }}
          >
            video
          </span>
          <span>for complete and clear instructions</span>
        </span>
        <div>
          <img
            style={{
              height: "30%",
              width: "30%",
              marginLeft: "40%",
              marginTop: 10,
            }}
            alt="play"
            src="/play.jpeg"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default NewTheme;
