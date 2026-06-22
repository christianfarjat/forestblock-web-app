/* eslint-disable @typescript-eslint/no-explicit-any */

import StepAirTravel from "./steps/StepAirTravel";
import StepBusTrip from "./steps/StepBusTrip";
import StepCarJourney from "./steps/StepCarJourney";
import StepElectricity from "./steps/StepElectricity";
import StepFuel from "./steps/StepFuel";
import StepHotelStay from "./steps/StepHotelStay";
import StepTrainJourney from "./steps/StepTrainJourney";
import StepWaterConsumption from "./steps/StepWaterConsumption";

const StepComponents: Record<string, React.FC<any>> = {
  airTravel: StepAirTravel,
  carJourney: StepCarJourney,
  electricityConsumption: StepElectricity,
  waterSupply: StepWaterConsumption,
  trainJourney: StepTrainJourney,
  busTrip: StepBusTrip,
  hotelStay: StepHotelStay,
  fuel: StepFuel,
};

export default StepComponents;
