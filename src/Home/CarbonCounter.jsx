import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CarbonCounter = () => {
  const { t } = useTranslation();

  const co2PerSecond = 1300;
  const creditsPerSecond = 16;
  const startDate = new Date('2025-01-01T00:00:00Z');

  const [co2Total, setCo2Total] = useState(0);
  const [creditTotal, setCreditTotal] = useState(0);

  useEffect(() => {
    const updateCounters = () => {
      const now = new Date();
      const secondsElapsed = Math.floor((now - startDate) / 1000);
      setCo2Total(secondsElapsed * co2PerSecond);
      setCreditTotal(secondsElapsed * creditsPerSecond);
    };

    updateCounters();
    const intervalId = setInterval(updateCounters, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.container}>
      <h1>🌿 {t("counter.heading")}</h1>
      <div style={styles.subtitle}>{t("counter.since")} January 1, 2025</div>

      <div style={styles.counterGrid}>
        <div style={{ ...styles.counterBox, ...styles.emissions }}>
          <div  id="rr2"style={styles.label}>{t("counter.emissions_label")}</div>
          <div style={{ ...styles.value, color: '#d32f2f' }}>{co2Total.toLocaleString()}</div>
          <div style={styles.unit}>{t("counter.emissions_unit")}</div>
        </div>

        <div style={{ ...styles.counterBox, ...styles.credits }}>
          <div id="rr2"style={styles.label}>{t("counter.credits_label")}</div>
          <div style={{ ...styles.value, color: '#2e7d32' }}>{creditTotal.toLocaleString()}</div>
          <div style={styles.unit}>{t("counter.credits_unit")}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '50px',
    borderRadius: '20px',
  },
  subtitle: {
    fontSize: '2em',
    color: '#aaa',
    marginBottom: '40px',
  },
  counterGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  counterBox: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '30px',
    width: '320px',
  },
  label: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  value: {
    fontSize: '2.2em',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  unit: {
    fontSize: '0.9em',
    color: '#666',
  },
  emissions: {},
  credits: {},
};

export default CarbonCounter;
