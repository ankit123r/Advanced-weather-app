import React from "react";
import moment from "moment";

const ForecastCard = ({ forecast }) => {
  if (!forecast || !forecast.dt_txt || !forecast.main || !forecast.weather) {
    return null; // Prevents crashing if data is missing
  }

  return (
    <div className="forecast-card">
      <p>{moment(forecast.dt_txt).format("ddd, h A")}</p>
      <p>{Math.round(forecast.main.temp)}°C</p>
      <p>{forecast.weather[0].description}</p>
    </div>
  );
};

export default ForecastCard;
