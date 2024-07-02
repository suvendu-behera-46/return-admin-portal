import { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import styles from "./Installation.module.scss";
import NewTheme from "../base/New-Theme-Component";
import OldTheme from "../base/Old-Theme-Component";

const InstallationGuide = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className={styles.container}>
      <h5 className={styles.heading}>Setup Installation Guide</h5>
      <p className={styles["thank-you"]}>Thank you for installing our app</p>
      <p className={styles["additional-text"]}>
        Please refer to the procedure below for installing wishlist in your
        store. If you want us to install code in your store, you can contact us
        at any time.
      </p>
      <Tabs
        style={{ marginTop: 20, marginLeft: 10 }}
        value={tabValue}
        onChange={handleTabChange}
        aria-label="theme tabs"
      >
        <Tab style={{ padding: 0 }} label="New 2.0 Theme" />
        <Tab style={{ padding: 0, marginLeft: 10 }} label="Old Theme" />
      </Tabs>
      {/* Content for the tabs */}
      {tabValue === 0 && <NewTheme></NewTheme>}
      {tabValue === 1 && <OldTheme></OldTheme>}
    </div>
  );
};

export default InstallationGuide;
