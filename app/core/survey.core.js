const db = require("../models");
const { handleResError } = require("../utils/err.util");
const { handleResSuccess } = require("../utils/success.util");
const { v4: uuidv4 } = require("uuid");
const User = db.user;
const Survey = db.survey;
const Survey2 = db.survey2;
const SurveyAccessMethod = db.surveyAccessMethod;

var randomString = require("random-string");

const dotenv = require("dotenv");
dotenv.config();
const moment = require("moment");
// const { userServices, tokenServices } = require("../services");

const insertSurveyData = async (req, res, next) => {
  try {
    const data = req.body;

    console.log(data);

    // replace white spaces with underscores
    Object.keys(data).forEach((key) => {
      var replacedKey = key.trim().replace(/ /g, "_");
      if (key !== replacedKey) {
        data[replacedKey] = data[key];
        delete data[key];
      }
    });

    // replace question mark and hypen with whitespace
    Object.keys(data).forEach((key) => {
      var replacedKey = key.replace(/\?|’|,/g, "");
      if (key !== replacedKey) {
        data[replacedKey] = data[key];
        delete data[key];
      }
    });

    //use Object.keys to loop over every value and replace white spaces with underscore
    Object.keys(data.contact).forEach((item) => {
      console.log(item);
      //first update the item's value
      //data.contact[item] = data.contact[item].replace(/ /g, "_");

      //add a new property to stories containing the changed item key
      const replacedKey = item.replace(/ /g, "_");

      if (item !== replacedKey) {
        //set the item's value to the new key
        data.contact[replacedKey] = data.contact[item];
        //delete the old key
        delete data.contact[item];
      }
    });

    const date_added = moment().format("YYYY-MM-DD");
    const respondent_id = randomString({ length: 6, special: false });

    let newData = { ...data, date_added, respondent_id };

    //  const newSurvey = await Survey.create(newData);

    const survey = new Survey(newData);
    survey.save((err, survey) => {
      if (err) {
        handleResError(res, 30, err);
        return;
      }
      console.log("Survey Saved");
      res.json(data)

      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Survey Saved", message);
    });
  } catch (error) {
    (err = `Error: ${error}`), handleResError(res, 30, err);
  }
};

const insertSurveyData2 = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);

    const date_added = moment().format("YYYY-MM-DD");
    const respondent_id = randomString({ length: 6, special: false });

    let newData = { ...data, date_added, respondent_id };

    const survey2 = new Survey2(newData);
    survey2.save((err, survey2) => {
      if (err) {
        handleResError(res, 30, err);
        return;
      }
      console.log("Survey2 Saved");
      res.json(newData)

      // message = {
      //   data: {
      //     survey2: survey2,
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Survey2 Saved", message);
    });
  } catch (error) {
    (err = `Error: ${error}`), handleResError(res, 30, err);
  }
};

const retrievePatientQuestionAndAnswer = async (req, res, next) => {
  const id = req.params.respondent_id;

  Survey.find({ respondent_id: id })
    .then((survey) => {
      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(
      //   res,
      //   res.statusCode,
      //   "Patient Question And Answer Retrieved",
      //   message
      // );
      res.json(survey)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const retrievePatientSurveyQuestionAndAnswer = async (req, res, next) => {
  const id = req.params.survey_id;
  console.log(id);
  Survey.findById(id)
    .then((survey) => {
      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(
      //   res,
      //   res.statusCode,
      //   "Patient Survey Question And Answer Retrieved",
      //   message
      // );
      res.json(survey)

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const retrieveAllRespondents = async (req, res, next) => {
  Survey.find()
    .sort({ date_added: -1 })
    .then((respondents) => {
      // message = {
      //   data: {
      //     respondents: respondents,
      //   },
      // };
      // handleResSuccess(
      //   res,
      //   res.statusCode,
      //   "Respondents Content Retrieved",
      //   message
      // );
      res.json(respondents)

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const retrieveAllSurveys = async (req, res, next) => {
  Survey.find()
    .then((survey) => {
      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(
      //   res,
      //   res.statusCode,
      //   "Survey Content Retrieved",
      //   message
      // );
      res.json(survey)

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const retrieveSurveyDataAnalytics = async (req, res, next) => {
  let surveySnapshot;
  surveySnapshot = await Survey.find({}, { _id: 0, __id__: 0 });
  //   console.log(surveySnapshot)

  const survey_data = [];

  let age = [];
  let gender = [];
  let race = [];
  let staff = [];
  let appointment = [];
  let health_center = [];
  let phone_calls_easily = [];
  let center_location = [];
  let phone_calls_returned = [];
  let time_waiting_room = [];
  let time_exam_room = [];
  let waiting_test_performed = [];
  let waiting_test_result = [];
  let front_desk_listen = [];
  let front_desk_behaviour = [];
  let receive_care = [];
  let other_sevices = [];
  let helpful_services = [];
  let friends_family = [];
  let scale_fee_program = [];
  let fair_fees = [];
  let fees_barrier = [];
  let health_dental_goal = [];
  let hospitalised_recently = [];
  let service_received_collection = [];

  surveySnapshot.forEach((doc) => {
    // console.log("doc", doc)
    //console.log("doc", doc)

    let id = doc.id;
    survey_data.push({ doc });
    age.push({ 0: doc.Age });
    gender.push({ 0: doc.Gender });
    race.push({ 0: doc.race });
    staff.push({ 0: doc.Staff });
    appointment.push({ 0: doc.ability_to_get_appointment }); //aility to get appointment":"3",
    health_center.push({ 0: doc.Health_center_hours_work_for_me }); // "Health center hours work for me":"4",
    phone_calls_easily.push({ 0: doc.Phone_calls_get_through_easily }); // "Phone calls get through easily":"2",
    center_location.push({ 0: doc.The_centers_location_is_convenient_for_me }); // "The center’s location is convenient for me":"2",
    phone_calls_returned.push({
      0: doc.Phone_calls_are_returned_within_24_hours,
    }); //"Phone calls are returned within 24 hours":"3",
    time_waiting_room.push({ 0: doc.Time_in_waiting_room }); // "Time in waiting room":"3",
    time_exam_room.push({ 0: doc.Time_in_exam_room }); // "Time in exam room":"2",
    waiting_test_performed.push({ 0: doc.Waiting_for_tests_to_be_performed }); //"Waiting for tests to be performed":"3",
    waiting_test_result.push({ 0: doc.Waiting_for_test_result }); // "Waiting for test result":"2",
    front_desk_listen.push({
      0: doc.Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    }); // "Did the front desk staff listen and answer your questions in a way you could understand?":"3",
    front_desk_behaviour.push({
      0: doc.Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    }); // "Did the front desk staff behave in a friendly and helpful manner":"2",
    receive_care.push({
      0: doc.Do_you_feel_that_you_could_receive_most_of_your_care_here,
    }); // "Do you feel that you could receive most of your care here":"No",
    other_sevices.push({
      0: doc.If_you_need_other_services_did_we_help_you_find_those_services,
    }); // "If you need other services, did we help you find those services":"Yes",
    helpful_services.push({
      0: doc.If_you_used_those_services_were_they_helpful,
    }); // "If you used those services, were they helpful":"No",
    friends_family.push({ 0: doc.Would_you_send_your_friends_and_family_here }); // "Would you send your friends and family here":"Yes",
    scale_fee_program.push({
      0: doc.Are_you_aware_of_our_sliding_scale_fee_program,
    }); // "Are you aware of our sliding scale fee program":"No",
    fair_fees.push({
      0: doc.Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    }); // "Do you feel that the fees CWWCHC charges are fair":"Yes",
    fees_barrier.push({
      0: doc.Do_you_feel_that_the_fees_are_a_barrier_to_care,
    }); // "Do you feel that the fees are a barrier to care":"No",
    health_dental_goal.push({
      0: doc.At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    }); // "At today’s visit did someone talk to you about your health or dental goals":"No",
    hospitalised_recently.push({
      0: doc.At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    }); // "At today’s visit were you asked if you had been in the hospital recently":"Yes"
    //service_received_collection.push({...doc.Service_Received});
  });

  const total_survey = await Survey.find({}).count();
  console.log(total_survey, total_survey);

  const age_range = age.map((object) => object[0]);

  const gender_range = gender.map((object) => object[0]);
  const race_range = race.map((object) => object[0]);
  const staff_range = staff.map((object) => object[0]);
  const appointment_range = appointment.map((object) => object[0]);
  const health_center_range = health_center.map((object) => object[0]);
  const phone_calls_easily_range = phone_calls_easily.map(
    (object) => object[0]
  );
  const center_location_range = center_location.map((object) => object[0]);
  const phone_calls_returned_range = phone_calls_returned.map(
    (object) => object[0]
  );
  const time_waiting_room_range = time_waiting_room.map((object) => object[0]);
  const time_exam_room_range = time_exam_room.map((object) => object[0]);
  const waiting_test_performed_range = waiting_test_performed.map(
    (object) => object[0]
  );
  const waiting_test_result_range = waiting_test_result.map(
    (object) => object[0]
  );
  const front_desk_listen_range = front_desk_listen.map((object) => object[0]);
  const front_desk_behaviour_range = front_desk_behaviour.map(
    (object) => object[0]
  );
  const receive_care_range = receive_care.map((object) => object[0]);
  const other_sevices_range = other_sevices.map((object) => object[0]);
  const helpful_services_range = helpful_services.map((object) => object[0]);
  const friends_family_range = friends_family.map((object) => object[0]);

  const scale_fee_program_range = scale_fee_program.map((object) => object[0]);
  const fair_fees_range = fair_fees.map((object) => object[0]);
  const fees_barrier_range = fees_barrier.map((object) => object[0]);
  const health_dental_goal_range = health_dental_goal.map(
    (object) => object[0]
  );
  const hospitalised_recently_range = hospitalised_recently.map(
    (object) => object[0]
  );
  ///////////////////////

  let age_analytics = {};
  let gender_analytics = {};
  let race_analytics = {};
  let staff_collection_analytics = {};
  let ability_to_get_appointment = {};
  let Health_center_hours_work_for_me = {};
  let Phone_calls_get_through_easily = {};
  let The_centers_location_is_convenient_for_me = {};
  let Phone_calls_are_returned_within_24_hours = {};
  let Time_in_waiting_room = {};
  let Time_in_exam_room = {};
  let Waiting_for_tests_to_be_performed = {};
  let Waiting_for_test_result = {};
  let Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand =
    {};
  let Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner = {};
  let Do_you_feel_that_you_could_receive_most_of_your_care_here = {};
  let If_you_need_other_services,
    _did_we_help_you_find_those_services = {};
  let If_you_used_those_services,
    _were_they_helpful = {};
  let Would_you_send_your_friends_and_family_here = {};
  let Are_you_aware_of_our_sliding_scale_fee_program = {};
  let Do_you_feel_that_the_fees_CWWCHC_charges_are_fair = {};
  let Do_you_feel_that_the_fees_are_a_barrier_to_care = {};
  let At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals =
    {};
  let At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently =
    {};

  age_range.forEach(function (x) {
    age_analytics[x] = (age_analytics[x] || 0) + 1;
  });

  gender_range.forEach(function (x) {
    gender_analytics[x] = (gender_analytics[x] || 0) + 1;
  });

  race_range.forEach(function (x) {
    race_analytics[x] = (race_analytics[x] || 0) + 1;
  });

  staff_range.forEach(function (x) {
    staff_collection_analytics[x] = (staff_collection_analytics[x] || 0) + 1;
  });

  appointment_range.forEach(function (x) {
    ability_to_get_appointment[x] = (ability_to_get_appointment[x] || 0) + 1;
  });

  health_center_range.forEach(function (x) {
    Health_center_hours_work_for_me[x] =
      (Health_center_hours_work_for_me[x] || 0) + 1;
  });

  phone_calls_easily_range.forEach(function (x) {
    Phone_calls_get_through_easily[x] =
      (Phone_calls_get_through_easily[x] || 0) + 1;
  });

  center_location_range.forEach(function (x) {
    The_centers_location_is_convenient_for_me[x] =
      (The_centers_location_is_convenient_for_me[x] || 0) + 1;
  });

  phone_calls_returned_range.forEach(function (x) {
    Phone_calls_are_returned_within_24_hours[x] =
      (Phone_calls_are_returned_within_24_hours[x] || 0) + 1;
  });

  time_waiting_room_range.forEach(function (x) {
    Time_in_waiting_room[x] = (Time_in_waiting_room[x] || 0) + 1;
  });

  time_exam_room_range.forEach(function (x) {
    Time_in_exam_room[x] = (Time_in_exam_room[x] || 0) + 1;
  });

  waiting_test_performed_range.forEach(function (x) {
    Waiting_for_tests_to_be_performed[x] =
      (Waiting_for_tests_to_be_performed[x] || 0) + 1;
  });

  waiting_test_result_range.forEach(function (x) {
    Waiting_for_test_result[x] = (Waiting_for_test_result[x] || 0) + 1;
  });

  front_desk_listen_range.forEach(function (x) {
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
      x
    ] =
      (Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
        x
      ] || 0) + 1;
  });

  front_desk_behaviour_range.forEach(function (x) {
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] =
      (Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] ||
        0) + 1;
  });

  receive_care_range.forEach(function (x) {
    Do_you_feel_that_you_could_receive_most_of_your_care_here[x] =
      (Do_you_feel_that_you_could_receive_most_of_your_care_here[x] || 0) + 1;
  });

  other_sevices_range.forEach(function (x) {
    If_you_need_other_services,
      (_did_we_help_you_find_those_services[x] =
        (If_you_need_other_services,
        _did_we_help_you_find_those_services[x] || 0) + 1);
  });

  helpful_services_range.forEach(function (x) {
    If_you_used_those_services,
      (_were_they_helpful[x] =
        (If_you_used_those_services, _were_they_helpful[x] || 0) + 1);
  });

  friends_family_range.forEach(function (x) {
    Would_you_send_your_friends_and_family_here[x] =
      (Would_you_send_your_friends_and_family_here[x] || 0) + 1;
  });

  scale_fee_program_range.forEach(function (x) {
    Are_you_aware_of_our_sliding_scale_fee_program[x] =
      (Are_you_aware_of_our_sliding_scale_fee_program[x] || 0) + 1;
  });

  fair_fees_range.forEach(function (x) {
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] =
      (Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] || 0) + 1;
  });

  fees_barrier_range.forEach(function (x) {
    Do_you_feel_that_the_fees_are_a_barrier_to_care[x] =
      (Do_you_feel_that_the_fees_are_a_barrier_to_care[x] || 0) + 1;
  });

  health_dental_goal_range.forEach(function (x) {
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
      x
    ] =
      (At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
        x
      ] || 0) + 1;
  });

  hospitalised_recently_range.forEach(function (x) {
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[x] =
      (At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[
        x
      ] || 0) + 1;
  });

  const survey_analytics = {
    total_survey,
    age_analytics,
    gender_analytics,
    race_analytics,
    staff_collection_analytics,
    ability_to_get_appointment,
    Health_center_hours_work_for_me,
    Phone_calls_get_through_easily,
    The_centers_location_is_convenient_for_me,
    Phone_calls_are_returned_within_24_hours,
    Time_in_waiting_room,
    Time_in_exam_room,
    Waiting_for_tests_to_be_performed,
    Waiting_for_test_result,
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    Do_you_feel_that_you_could_receive_most_of_your_care_here,
    Would_you_send_your_friends_and_family_here,
    Are_you_aware_of_our_sliding_scale_fee_program,
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    Do_you_feel_that_the_fees_are_a_barrier_to_care,
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    //service_received_collection,
  };

  res.json(survey_analytics);
};

const retrieveCurrentSortedSurveyDataAnalytics = async (req, res, next) => {
  const date_added = moment().format("YYYY-MM-DD");
  console.log(date_added);
  let surveySnapshot;
  surveySnapshot = await Survey.find(
    { date_added: date_added },
    { _id: 0, __id__: 0 }
  );

  const survey_data = [];

  let age = [];
  let gender = [];
  let race = [];
  let staff = [];
  let appointment = [];
  let health_center = [];
  let phone_calls_easily = [];
  let center_location = [];
  let phone_calls_returned = [];
  let time_waiting_room = [];
  let time_exam_room = [];
  let waiting_test_performed = [];
  let waiting_test_result = [];
  let front_desk_listen = [];
  let front_desk_behaviour = [];
  let receive_care = [];
  let other_sevices = [];
  let helpful_services = [];
  let friends_family = [];
  let scale_fee_program = [];
  let fair_fees = [];
  let fees_barrier = [];
  let health_dental_goal = [];
  let hospitalised_recently = [];
  let service_received_collection = [];

  surveySnapshot.forEach((doc) => {
    // console.log("doc", doc)
    //console.log("doc", doc)

    let id = doc.id;
    survey_data.push({ doc });
    age.push({ 0: doc.Age });
    gender.push({ 0: doc.Gender });
    race.push({ 0: doc.race });
    staff.push({ 0: doc.Staff });
    appointment.push({ 0: doc.ability_to_get_appointment }); //aility to get appointment":"3",
    health_center.push({ 0: doc.Health_center_hours_work_for_me }); // "Health center hours work for me":"4",
    phone_calls_easily.push({ 0: doc.Phone_calls_get_through_easily }); // "Phone calls get through easily":"2",
    center_location.push({ 0: doc.The_centers_location_is_convenient_for_me }); // "The center’s location is convenient for me":"2",
    phone_calls_returned.push({
      0: doc.Phone_calls_are_returned_within_24_hours,
    }); //"Phone calls are returned within 24 hours":"3",
    time_waiting_room.push({ 0: doc.Time_in_waiting_room }); // "Time in waiting room":"3",
    time_exam_room.push({ 0: doc.Time_in_exam_room }); // "Time in exam room":"2",
    waiting_test_performed.push({ 0: doc.Waiting_for_tests_to_be_performed }); //"Waiting for tests to be performed":"3",
    waiting_test_result.push({ 0: doc.Waiting_for_test_result }); // "Waiting for test result":"2",
    front_desk_listen.push({
      0: doc.Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    }); // "Did the front desk staff listen and answer your questions in a way you could understand?":"3",
    front_desk_behaviour.push({
      0: doc.Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    }); // "Did the front desk staff behave in a friendly and helpful manner":"2",
    receive_care.push({
      0: doc.Do_you_feel_that_you_could_receive_most_of_your_care_here,
    }); // "Do you feel that you could receive most of your care here":"No",
    other_sevices.push({
      0: doc.If_you_need_other_services_did_we_help_you_find_those_services,
    }); // "If you need other services, did we help you find those services":"Yes",
    helpful_services.push({
      0: doc.If_you_used_those_services_were_they_helpful,
    }); // "If you used those services, were they helpful":"No",
    friends_family.push({ 0: doc.Would_you_send_your_friends_and_family_here }); // "Would you send your friends and family here":"Yes",
    scale_fee_program.push({
      0: doc.Are_you_aware_of_our_sliding_scale_fee_program,
    }); // "Are you aware of our sliding scale fee program":"No",
    fair_fees.push({
      0: doc.Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    }); // "Do you feel that the fees CWWCHC charges are fair":"Yes",
    fees_barrier.push({
      0: doc.Do_you_feel_that_the_fees_are_a_barrier_to_care,
    }); // "Do you feel that the fees are a barrier to care":"No",
    health_dental_goal.push({
      0: doc.At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    }); // "At today’s visit did someone talk to you about your health or dental goals":"No",
    hospitalised_recently.push({
      0: doc.At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    }); // "At today’s visit were you asked if you had been in the hospital recently":"Yes"
    //service_received_collection.push({...doc.Service_Received});
  });

  const total_survey = await Survey.find({}).count();

  const age_range = age.map((object) => object[0]);

  const gender_range = gender.map((object) => object[0]);
  const race_range = race.map((object) => object[0]);
  const staff_range = staff.map((object) => object[0]);
  const appointment_range = appointment.map((object) => object[0]);
  const health_center_range = health_center.map((object) => object[0]);
  const phone_calls_easily_range = phone_calls_easily.map(
    (object) => object[0]
  );
  const center_location_range = center_location.map((object) => object[0]);
  const phone_calls_returned_range = phone_calls_returned.map(
    (object) => object[0]
  );
  const time_waiting_room_range = time_waiting_room.map((object) => object[0]);
  const time_exam_room_range = time_exam_room.map((object) => object[0]);
  const waiting_test_performed_range = waiting_test_performed.map(
    (object) => object[0]
  );
  const waiting_test_result_range = waiting_test_result.map(
    (object) => object[0]
  );
  const front_desk_listen_range = front_desk_listen.map((object) => object[0]);
  const front_desk_behaviour_range = front_desk_behaviour.map(
    (object) => object[0]
  );
  const receive_care_range = receive_care.map((object) => object[0]);
  const other_sevices_range = other_sevices.map((object) => object[0]);
  const helpful_services_range = helpful_services.map((object) => object[0]);
  const friends_family_range = friends_family.map((object) => object[0]);

  const scale_fee_program_range = scale_fee_program.map((object) => object[0]);
  const fair_fees_range = fair_fees.map((object) => object[0]);
  const fees_barrier_range = fees_barrier.map((object) => object[0]);
  const health_dental_goal_range = health_dental_goal.map(
    (object) => object[0]
  );
  const hospitalised_recently_range = hospitalised_recently.map(
    (object) => object[0]
  );
  ///////////////////////

  let age_analytics = {};
  let gender_analytics = {};
  let race_analytics = {};
  let staff_collection_analytics = {};
  let ability_to_get_appointment = {};
  let Health_center_hours_work_for_me = {};
  let Phone_calls_get_through_easily = {};
  let The_centers_location_is_convenient_for_me = {};
  let Phone_calls_are_returned_within_24_hours = {};
  let Time_in_waiting_room = {};
  let Time_in_exam_room = {};
  let Waiting_for_tests_to_be_performed = {};
  let Waiting_for_test_result = {};
  let Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand =
    {};
  let Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner = {};
  let Do_you_feel_that_you_could_receive_most_of_your_care_here = {};
  let If_you_need_other_services,
    _did_we_help_you_find_those_services = {};
  let If_you_used_those_services,
    _were_they_helpful = {};
  let Would_you_send_your_friends_and_family_here = {};
  let Are_you_aware_of_our_sliding_scale_fee_program = {};
  let Do_you_feel_that_the_fees_CWWCHC_charges_are_fair = {};
  let Do_you_feel_that_the_fees_are_a_barrier_to_care = {};
  let At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals =
    {};
  let At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently =
    {};

  age_range.forEach(function (x) {
    age_analytics[x] = (age_analytics[x] || 0) + 1;
  });

  gender_range.forEach(function (x) {
    gender_analytics[x] = (gender_analytics[x] || 0) + 1;
  });

  race_range.forEach(function (x) {
    race_analytics[x] = (race_analytics[x] || 0) + 1;
  });

  staff_range.forEach(function (x) {
    staff_collection_analytics[x] = (staff_collection_analytics[x] || 0) + 1;
  });

  appointment_range.forEach(function (x) {
    ability_to_get_appointment[x] = (ability_to_get_appointment[x] || 0) + 1;
  });

  health_center_range.forEach(function (x) {
    Health_center_hours_work_for_me[x] =
      (Health_center_hours_work_for_me[x] || 0) + 1;
  });

  phone_calls_easily_range.forEach(function (x) {
    Phone_calls_get_through_easily[x] =
      (Phone_calls_get_through_easily[x] || 0) + 1;
  });

  center_location_range.forEach(function (x) {
    The_centers_location_is_convenient_for_me[x] =
      (The_centers_location_is_convenient_for_me[x] || 0) + 1;
  });

  phone_calls_returned_range.forEach(function (x) {
    Phone_calls_are_returned_within_24_hours[x] =
      (Phone_calls_are_returned_within_24_hours[x] || 0) + 1;
  });

  time_waiting_room_range.forEach(function (x) {
    Time_in_waiting_room[x] = (Time_in_waiting_room[x] || 0) + 1;
  });

  time_exam_room_range.forEach(function (x) {
    Time_in_exam_room[x] = (Time_in_exam_room[x] || 0) + 1;
  });

  waiting_test_performed_range.forEach(function (x) {
    Waiting_for_tests_to_be_performed[x] =
      (Waiting_for_tests_to_be_performed[x] || 0) + 1;
  });

  waiting_test_result_range.forEach(function (x) {
    Waiting_for_test_result[x] = (Waiting_for_test_result[x] || 0) + 1;
  });

  front_desk_listen_range.forEach(function (x) {
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
      x
    ] =
      (Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
        x
      ] || 0) + 1;
  });

  front_desk_behaviour_range.forEach(function (x) {
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] =
      (Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] ||
        0) + 1;
  });

  receive_care_range.forEach(function (x) {
    Do_you_feel_that_you_could_receive_most_of_your_care_here[x] =
      (Do_you_feel_that_you_could_receive_most_of_your_care_here[x] || 0) + 1;
  });

  other_sevices_range.forEach(function (x) {
    If_you_need_other_services,
      (_did_we_help_you_find_those_services[x] =
        (If_you_need_other_services,
        _did_we_help_you_find_those_services[x] || 0) + 1);
  });

  helpful_services_range.forEach(function (x) {
    If_you_used_those_services,
      (_were_they_helpful[x] =
        (If_you_used_those_services, _were_they_helpful[x] || 0) + 1);
  });

  friends_family_range.forEach(function (x) {
    Would_you_send_your_friends_and_family_here[x] =
      (Would_you_send_your_friends_and_family_here[x] || 0) + 1;
  });

  scale_fee_program_range.forEach(function (x) {
    Are_you_aware_of_our_sliding_scale_fee_program[x] =
      (Are_you_aware_of_our_sliding_scale_fee_program[x] || 0) + 1;
  });

  fair_fees_range.forEach(function (x) {
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] =
      (Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] || 0) + 1;
  });

  fees_barrier_range.forEach(function (x) {
    Do_you_feel_that_the_fees_are_a_barrier_to_care[x] =
      (Do_you_feel_that_the_fees_are_a_barrier_to_care[x] || 0) + 1;
  });

  health_dental_goal_range.forEach(function (x) {
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
      x
    ] =
      (At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
        x
      ] || 0) + 1;
  });

  hospitalised_recently_range.forEach(function (x) {
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[x] =
      (At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[
        x
      ] || 0) + 1;
  });

  const survey_analytics = {
    total_survey,
    age_analytics,
    gender_analytics,
    race_analytics,
    staff_collection_analytics,
    ability_to_get_appointment,
    Health_center_hours_work_for_me,
    Phone_calls_get_through_easily,
    The_centers_location_is_convenient_for_me,
    Phone_calls_are_returned_within_24_hours,
    Time_in_waiting_room,
    Time_in_exam_room,
    Waiting_for_tests_to_be_performed,
    Waiting_for_test_result,
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    Do_you_feel_that_you_could_receive_most_of_your_care_here,
    Would_you_send_your_friends_and_family_here,
    Are_you_aware_of_our_sliding_scale_fee_program,
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    Do_you_feel_that_the_fees_are_a_barrier_to_care,
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    //service_received_collection,
  };

  res.json(survey_analytics);
};

const retrieveCurrentSortedSurveyDataAnalytics2 = async (req, res, next) => {
  const date_added = moment().format("YYYY-MM-DD");
  console.log(date_added);
  let surveySnapshot;
  surveySnapshot = await Survey2.find(
    { date_added: date_added },
    { _id: 0, __id__: 0 }
  );

  const survey_data = [];

  let age = [];
  let gender = [];
  let race = [];
  let staff = [];
  let appointment = [];
  let health_center = [];
  let phone_calls_easily = [];
  let center_location = [];
  let phone_calls_returned = [];
  let time_waiting_room = [];
  let time_exam_room = [];
  let waiting_test_performed = [];
  let waiting_test_result = [];
  let front_desk_listen = [];
  let front_desk_behaviour = [];
  let receive_care = [];
  let other_sevices = [];
  let helpful_services = [];
  let friends_family = [];
  let scale_fee_program = [];
  let fair_fees = [];
  let fees_barrier = [];
  let health_dental_goal = [];
  let hospitalised_recently = [];
  let service_received_collection = [];

  surveySnapshot.forEach((doc) => {
    // console.log("doc", doc)
    //console.log("doc", doc)

    let id = doc.id;
    survey_data.push({ doc });
    age.push({ 0: doc.Age });
    gender.push({ 0: doc.Gender });
    race.push({ 0: doc.race });
    staff.push({ 0: doc.Staff });
    appointment.push({ 0: doc.ability_to_get_appointment }); //aility to get appointment":"3",
    health_center.push({ 0: doc.Health_center_hours_work_for_me }); // "Health center hours work for me":"4",
    phone_calls_easily.push({ 0: doc.Phone_calls_get_through_easily }); // "Phone calls get through easily":"2",
    center_location.push({ 0: doc.The_centers_location_is_convenient_for_me }); // "The center’s location is convenient for me":"2",
    phone_calls_returned.push({
      0: doc.Phone_calls_are_returned_within_24_hours,
    }); //"Phone calls are returned within 24 hours":"3",
    time_waiting_room.push({ 0: doc.Time_in_waiting_room }); // "Time in waiting room":"3",
    time_exam_room.push({ 0: doc.Time_in_exam_room }); // "Time in exam room":"2",
    waiting_test_performed.push({ 0: doc.Waiting_for_tests_to_be_performed }); //"Waiting for tests to be performed":"3",
    waiting_test_result.push({ 0: doc.Waiting_for_test_result }); // "Waiting for test result":"2",
    front_desk_listen.push({
      0: doc.Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    }); // "Did the front desk staff listen and answer your questions in a way you could understand?":"3",
    front_desk_behaviour.push({
      0: doc.Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    }); // "Did the front desk staff behave in a friendly and helpful manner":"2",
    receive_care.push({
      0: doc.Do_you_feel_that_you_could_receive_most_of_your_care_here,
    }); // "Do you feel that you could receive most of your care here":"No",
    other_sevices.push({
      0: doc.If_you_need_other_services_did_we_help_you_find_those_services,
    }); // "If you need other services, did we help you find those services":"Yes",
    helpful_services.push({
      0: doc.If_you_used_those_services_were_they_helpful,
    }); // "If you used those services, were they helpful":"No",
    friends_family.push({ 0: doc.Would_you_send_your_friends_and_family_here }); // "Would you send your friends and family here":"Yes",
    scale_fee_program.push({
      0: doc.Are_you_aware_of_our_sliding_scale_fee_program,
    }); // "Are you aware of our sliding scale fee program":"No",
    fair_fees.push({
      0: doc.Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    }); // "Do you feel that the fees CWWCHC charges are fair":"Yes",
    fees_barrier.push({
      0: doc.Do_you_feel_that_the_fees_are_a_barrier_to_care,
    }); // "Do you feel that the fees are a barrier to care":"No",
    health_dental_goal.push({
      0: doc.At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    }); // "At today’s visit did someone talk to you about your health or dental goals":"No",
    hospitalised_recently.push({
      0: doc.At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    }); // "At today’s visit were you asked if you had been in the hospital recently":"Yes"
    //service_received_collection.push({...doc.Service_Received});
  });

  const total_survey = await Survey.find({}).count();

  const age_range = age.map((object) => object[0]);

  const gender_range = gender.map((object) => object[0]);
  const race_range = race.map((object) => object[0]);
  const staff_range = staff.map((object) => object[0]);
  const appointment_range = appointment.map((object) => object[0]);
  const health_center_range = health_center.map((object) => object[0]);
  const phone_calls_easily_range = phone_calls_easily.map(
    (object) => object[0]
  );
  const center_location_range = center_location.map((object) => object[0]);
  const phone_calls_returned_range = phone_calls_returned.map(
    (object) => object[0]
  );
  const time_waiting_room_range = time_waiting_room.map((object) => object[0]);
  const time_exam_room_range = time_exam_room.map((object) => object[0]);
  const waiting_test_performed_range = waiting_test_performed.map(
    (object) => object[0]
  );
  const waiting_test_result_range = waiting_test_result.map(
    (object) => object[0]
  );
  const front_desk_listen_range = front_desk_listen.map((object) => object[0]);
  const front_desk_behaviour_range = front_desk_behaviour.map(
    (object) => object[0]
  );
  const receive_care_range = receive_care.map((object) => object[0]);
  const other_sevices_range = other_sevices.map((object) => object[0]);
  const helpful_services_range = helpful_services.map((object) => object[0]);
  const friends_family_range = friends_family.map((object) => object[0]);

  const scale_fee_program_range = scale_fee_program.map((object) => object[0]);
  const fair_fees_range = fair_fees.map((object) => object[0]);
  const fees_barrier_range = fees_barrier.map((object) => object[0]);
  const health_dental_goal_range = health_dental_goal.map(
    (object) => object[0]
  );
  const hospitalised_recently_range = hospitalised_recently.map(
    (object) => object[0]
  );
  ///////////////////////

  let age_analytics = {};
  let gender_analytics = {};
  let race_analytics = {};
  let staff_collection_analytics = {};
  let ability_to_get_appointment = {};
  let Health_center_hours_work_for_me = {};
  let Phone_calls_get_through_easily = {};
  let The_centers_location_is_convenient_for_me = {};
  let Phone_calls_are_returned_within_24_hours = {};
  let Time_in_waiting_room = {};
  let Time_in_exam_room = {};
  let Waiting_for_tests_to_be_performed = {};
  let Waiting_for_test_result = {};
  let Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand =
    {};
  let Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner = {};
  let Do_you_feel_that_you_could_receive_most_of_your_care_here = {};
  let If_you_need_other_services,
    _did_we_help_you_find_those_services = {};
  let If_you_used_those_services,
    _were_they_helpful = {};
  let Would_you_send_your_friends_and_family_here = {};
  let Are_you_aware_of_our_sliding_scale_fee_program = {};
  let Do_you_feel_that_the_fees_CWWCHC_charges_are_fair = {};
  let Do_you_feel_that_the_fees_are_a_barrier_to_care = {};
  let At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals =
    {};
  let At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently =
    {};

  age_range.forEach(function (x) {
    age_analytics[x] = (age_analytics[x] || 0) + 1;
  });

  gender_range.forEach(function (x) {
    gender_analytics[x] = (gender_analytics[x] || 0) + 1;
  });

  race_range.forEach(function (x) {
    race_analytics[x] = (race_analytics[x] || 0) + 1;
  });

  staff_range.forEach(function (x) {
    staff_collection_analytics[x] = (staff_collection_analytics[x] || 0) + 1;
  });

  appointment_range.forEach(function (x) {
    ability_to_get_appointment[x] = (ability_to_get_appointment[x] || 0) + 1;
  });

  health_center_range.forEach(function (x) {
    Health_center_hours_work_for_me[x] =
      (Health_center_hours_work_for_me[x] || 0) + 1;
  });

  phone_calls_easily_range.forEach(function (x) {
    Phone_calls_get_through_easily[x] =
      (Phone_calls_get_through_easily[x] || 0) + 1;
  });

  center_location_range.forEach(function (x) {
    The_centers_location_is_convenient_for_me[x] =
      (The_centers_location_is_convenient_for_me[x] || 0) + 1;
  });

  phone_calls_returned_range.forEach(function (x) {
    Phone_calls_are_returned_within_24_hours[x] =
      (Phone_calls_are_returned_within_24_hours[x] || 0) + 1;
  });

  time_waiting_room_range.forEach(function (x) {
    Time_in_waiting_room[x] = (Time_in_waiting_room[x] || 0) + 1;
  });

  time_exam_room_range.forEach(function (x) {
    Time_in_exam_room[x] = (Time_in_exam_room[x] || 0) + 1;
  });

  waiting_test_performed_range.forEach(function (x) {
    Waiting_for_tests_to_be_performed[x] =
      (Waiting_for_tests_to_be_performed[x] || 0) + 1;
  });

  waiting_test_result_range.forEach(function (x) {
    Waiting_for_test_result[x] = (Waiting_for_test_result[x] || 0) + 1;
  });

  front_desk_listen_range.forEach(function (x) {
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
      x
    ] =
      (Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
        x
      ] || 0) + 1;
  });

  front_desk_behaviour_range.forEach(function (x) {
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] =
      (Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] ||
        0) + 1;
  });

  receive_care_range.forEach(function (x) {
    Do_you_feel_that_you_could_receive_most_of_your_care_here[x] =
      (Do_you_feel_that_you_could_receive_most_of_your_care_here[x] || 0) + 1;
  });

  other_sevices_range.forEach(function (x) {
    If_you_need_other_services,
      (_did_we_help_you_find_those_services[x] =
        (If_you_need_other_services,
        _did_we_help_you_find_those_services[x] || 0) + 1);
  });

  helpful_services_range.forEach(function (x) {
    If_you_used_those_services,
      (_were_they_helpful[x] =
        (If_you_used_those_services, _were_they_helpful[x] || 0) + 1);
  });

  friends_family_range.forEach(function (x) {
    Would_you_send_your_friends_and_family_here[x] =
      (Would_you_send_your_friends_and_family_here[x] || 0) + 1;
  });

  scale_fee_program_range.forEach(function (x) {
    Are_you_aware_of_our_sliding_scale_fee_program[x] =
      (Are_you_aware_of_our_sliding_scale_fee_program[x] || 0) + 1;
  });

  fair_fees_range.forEach(function (x) {
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] =
      (Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] || 0) + 1;
  });

  fees_barrier_range.forEach(function (x) {
    Do_you_feel_that_the_fees_are_a_barrier_to_care[x] =
      (Do_you_feel_that_the_fees_are_a_barrier_to_care[x] || 0) + 1;
  });

  health_dental_goal_range.forEach(function (x) {
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
      x
    ] =
      (At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
        x
      ] || 0) + 1;
  });

  hospitalised_recently_range.forEach(function (x) {
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[x] =
      (At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[
        x
      ] || 0) + 1;
  });

  const survey_analytics = {
    total_survey,
    age_analytics,
    gender_analytics,
    race_analytics,
    staff_collection_analytics,
    ability_to_get_appointment,
    Health_center_hours_work_for_me,
    Phone_calls_get_through_easily,
    The_centers_location_is_convenient_for_me,
    Phone_calls_are_returned_within_24_hours,
    Time_in_waiting_room,
    Time_in_exam_room,
    Waiting_for_tests_to_be_performed,
    Waiting_for_test_result,
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    Do_you_feel_that_you_could_receive_most_of_your_care_here,
    Would_you_send_your_friends_and_family_here,
    Are_you_aware_of_our_sliding_scale_fee_program,
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    Do_you_feel_that_the_fees_are_a_barrier_to_care,
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    //service_received_collection,
  };

  res.json(survey_analytics);
};

const retrieveSortedSurveyDataAnalytics = async (req, res, next) => {
  const data = req.body;

  let age = [];
  let gender = [];
  let race = [];
  let staff = [];
  let appointment = [];
  let health_center = [];
  let phone_calls_easily = [];
  let center_location = [];
  let phone_calls_returned = [];
  let time_waiting_room = [];
  let time_exam_room = [];
  let waiting_test_performed = [];
  let waiting_test_result = [];
  let front_desk_listen = [];
  let front_desk_behaviour = [];
  let receive_care = [];
  let other_sevices = [];
  let helpful_services = [];
  let friends_family = [];
  let scale_fee_program = [];
  let fair_fees = [];
  let fees_barrier = [];
  let health_dental_goal = [];
  let hospitalised_recently = [];

  data.forEach((doc) => {
    age.push({ 0: doc.Age });
    gender.push({ 0: doc.Gender });
    race.push({ 0: doc.race });
    staff.push({ 0: doc.Staff });
    appointment.push({ 0: doc.ability_to_get_appointment }); //aility to get appointment":"3",
    health_center.push({ 0: doc.Health_center_hours_work_for_me }); // "Health center hours work for me":"4",
    phone_calls_easily.push({ 0: doc.Phone_calls_get_through_easily }); // "Phone calls get through easily":"2",
    center_location.push({ 0: doc.The_centers_location_is_convenient_for_me }); // "The center’s location is convenient for me":"2",
    phone_calls_returned.push({
      0: doc.Phone_calls_are_returned_within_24_hours,
    }); //"Phone calls are returned within 24 hours":"3",
    time_waiting_room.push({ 0: doc.Time_in_waiting_room }); // "Time in waiting room":"3",
    time_exam_room.push({ 0: doc.Time_in_exam_room }); // "Time in exam room":"2",
    waiting_test_performed.push({ 0: doc.Waiting_for_tests_to_be_performed }); //"Waiting for tests to be performed":"3",
    waiting_test_result.push({ 0: doc.Waiting_for_test_result }); // "Waiting for test result":"2",
    front_desk_listen.push({
      0: doc.Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    }); // "Did the front desk staff listen and answer your questions in a way you could understand?":"3",
    front_desk_behaviour.push({
      0: doc.Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    }); // "Did the front desk staff behave in a friendly and helpful manner":"2",
    receive_care.push({
      0: doc.Do_you_feel_that_you_could_receive_most_of_your_care_here,
    }); // "Do you feel that you could receive most of your care here":"No",
    other_sevices.push({
      0: doc.If_you_need_other_services_did_we_help_you_find_those_services,
    }); // "If you need other services, did we help you find those services":"Yes",
    helpful_services.push({
      0: doc.If_you_used_those_services_were_they_helpful,
    }); // "If you used those services, were they helpful":"No",
    friends_family.push({ 0: doc.Would_you_send_your_friends_and_family_here }); // "Would you send your friends and family here":"Yes",
    scale_fee_program.push({
      0: doc.Are_you_aware_of_our_sliding_scale_fee_program,
    }); // "Are you aware of our sliding scale fee program":"No",
    fair_fees.push({
      0: doc.Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    }); // "Do you feel that the fees CWWCHC charges are fair":"Yes",
    fees_barrier.push({
      0: doc.Do_you_feel_that_the_fees_are_a_barrier_to_care,
    }); // "Do you feel that the fees are a barrier to care":"No",
    health_dental_goal.push({
      0: doc.At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    }); // "At today’s visit did someone talk to you about your health or dental goals":"No",
    hospitalised_recently.push({
      0: doc.At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    }); // "At today’s visit were you asked if you had been in the hospital recently":"Yes"
    //service_received_collection.push({...doc.Service_Received});
  });

  const total_survey = data.length;
  console.log(total_survey, total_survey);

  const age_range = age.map((object) => object[0]);

  const gender_range = gender.map((object) => object[0]);
  const race_range = race.map((object) => object[0]);
  const staff_range = staff.map((object) => object[0]);
  const appointment_range = appointment.map((object) => object[0]);
  const health_center_range = health_center.map((object) => object[0]);
  const phone_calls_easily_range = phone_calls_easily.map(
    (object) => object[0]
  );
  const center_location_range = center_location.map((object) => object[0]);
  const phone_calls_returned_range = phone_calls_returned.map(
    (object) => object[0]
  );
  const time_waiting_room_range = time_waiting_room.map((object) => object[0]);
  const time_exam_room_range = time_exam_room.map((object) => object[0]);
  const waiting_test_performed_range = waiting_test_performed.map(
    (object) => object[0]
  );
  const waiting_test_result_range = waiting_test_result.map(
    (object) => object[0]
  );
  const front_desk_listen_range = front_desk_listen.map((object) => object[0]);
  const front_desk_behaviour_range = front_desk_behaviour.map(
    (object) => object[0]
  );
  const receive_care_range = receive_care.map((object) => object[0]);
  const other_sevices_range = other_sevices.map((object) => object[0]);
  const helpful_services_range = helpful_services.map((object) => object[0]);
  const friends_family_range = friends_family.map((object) => object[0]);

  const scale_fee_program_range = scale_fee_program.map((object) => object[0]);
  const fair_fees_range = fair_fees.map((object) => object[0]);
  const fees_barrier_range = fees_barrier.map((object) => object[0]);
  const health_dental_goal_range = health_dental_goal.map(
    (object) => object[0]
  );
  const hospitalised_recently_range = hospitalised_recently.map(
    (object) => object[0]
  );
  ///////////////////////

  let age_analytics = {};
  let gender_analytics = {};
  let race_analytics = {};
  let staff_collection_analytics = {};
  let ability_to_get_appointment = {};
  let Health_center_hours_work_for_me = {};
  let Phone_calls_get_through_easily = {};
  let The_centers_location_is_convenient_for_me = {};
  let Phone_calls_are_returned_within_24_hours = {};
  let Time_in_waiting_room = {};
  let Time_in_exam_room = {};
  let Waiting_for_tests_to_be_performed = {};
  let Waiting_for_test_result = {};
  let Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand =
    {};
  let Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner = {};
  let Do_you_feel_that_you_could_receive_most_of_your_care_here = {};
  let If_you_need_other_services,
    _did_we_help_you_find_those_services = {};
  let If_you_used_those_services,
    _were_they_helpful = {};
  let Would_you_send_your_friends_and_family_here = {};
  let Are_you_aware_of_our_sliding_scale_fee_program = {};
  let Do_you_feel_that_the_fees_CWWCHC_charges_are_fair = {};
  let Do_you_feel_that_the_fees_are_a_barrier_to_care = {};
  let At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals =
    {};
  let At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently =
    {};

  age_range.forEach(function (x) {
    age_analytics[x] = (age_analytics[x] || 0) + 1;
  });

  gender_range.forEach(function (x) {
    gender_analytics[x] = (gender_analytics[x] || 0) + 1;
  });

  race_range.forEach(function (x) {
    race_analytics[x] = (race_analytics[x] || 0) + 1;
  });

  staff_range.forEach(function (x) {
    staff_collection_analytics[x] = (staff_collection_analytics[x] || 0) + 1;
  });

  appointment_range.forEach(function (x) {
    ability_to_get_appointment[x] = (ability_to_get_appointment[x] || 0) + 1;
  });

  health_center_range.forEach(function (x) {
    Health_center_hours_work_for_me[x] =
      (Health_center_hours_work_for_me[x] || 0) + 1;
  });

  phone_calls_easily_range.forEach(function (x) {
    Phone_calls_get_through_easily[x] =
      (Phone_calls_get_through_easily[x] || 0) + 1;
  });

  center_location_range.forEach(function (x) {
    The_centers_location_is_convenient_for_me[x] =
      (The_centers_location_is_convenient_for_me[x] || 0) + 1;
  });

  phone_calls_returned_range.forEach(function (x) {
    Phone_calls_are_returned_within_24_hours[x] =
      (Phone_calls_are_returned_within_24_hours[x] || 0) + 1;
  });

  time_waiting_room_range.forEach(function (x) {
    Time_in_waiting_room[x] = (Time_in_waiting_room[x] || 0) + 1;
  });

  time_exam_room_range.forEach(function (x) {
    Time_in_exam_room[x] = (Time_in_exam_room[x] || 0) + 1;
  });

  waiting_test_performed_range.forEach(function (x) {
    Waiting_for_tests_to_be_performed[x] =
      (Waiting_for_tests_to_be_performed[x] || 0) + 1;
  });

  waiting_test_result_range.forEach(function (x) {
    Waiting_for_test_result[x] = (Waiting_for_test_result[x] || 0) + 1;
  });

  front_desk_listen_range.forEach(function (x) {
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
      x
    ] =
      (Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand[
        x
      ] || 0) + 1;
  });

  front_desk_behaviour_range.forEach(function (x) {
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] =
      (Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner[x] ||
        0) + 1;
  });

  receive_care_range.forEach(function (x) {
    Do_you_feel_that_you_could_receive_most_of_your_care_here[x] =
      (Do_you_feel_that_you_could_receive_most_of_your_care_here[x] || 0) + 1;
  });

  other_sevices_range.forEach(function (x) {
    If_you_need_other_services,
      (_did_we_help_you_find_those_services[x] =
        (If_you_need_other_services,
        _did_we_help_you_find_those_services[x] || 0) + 1);
  });

  helpful_services_range.forEach(function (x) {
    If_you_used_those_services,
      (_were_they_helpful[x] =
        (If_you_used_those_services, _were_they_helpful[x] || 0) + 1);
  });

  friends_family_range.forEach(function (x) {
    Would_you_send_your_friends_and_family_here[x] =
      (Would_you_send_your_friends_and_family_here[x] || 0) + 1;
  });

  scale_fee_program_range.forEach(function (x) {
    Are_you_aware_of_our_sliding_scale_fee_program[x] =
      (Are_you_aware_of_our_sliding_scale_fee_program[x] || 0) + 1;
  });

  fair_fees_range.forEach(function (x) {
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] =
      (Do_you_feel_that_the_fees_CWWCHC_charges_are_fair[x] || 0) + 1;
  });

  fees_barrier_range.forEach(function (x) {
    Do_you_feel_that_the_fees_are_a_barrier_to_care[x] =
      (Do_you_feel_that_the_fees_are_a_barrier_to_care[x] || 0) + 1;
  });

  health_dental_goal_range.forEach(function (x) {
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
      x
    ] =
      (At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals[
        x
      ] || 0) + 1;
  });

  hospitalised_recently_range.forEach(function (x) {
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[x] =
      (At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently[
        x
      ] || 0) + 1;
  });

  const survey_analytics = {
    total_survey,
    age_analytics,
    gender_analytics,
    race_analytics,
    staff_collection_analytics,
    ability_to_get_appointment,
    Health_center_hours_work_for_me,
    Phone_calls_get_through_easily,
    The_centers_location_is_convenient_for_me,
    Phone_calls_are_returned_within_24_hours,
    Time_in_waiting_room,
    Time_in_exam_room,
    Waiting_for_tests_to_be_performed,
    Waiting_for_test_result,
    Did_the_front_desk_staff_listen_and_answer_your_questions_in_a_way_you_could_understand,
    Did_the_front_desk_staff_behave_in_a_friendly_and_helpful_manner,
    Do_you_feel_that_you_could_receive_most_of_your_care_here,
    Would_you_send_your_friends_and_family_here,
    Are_you_aware_of_our_sliding_scale_fee_program,
    Do_you_feel_that_the_fees_CWWCHC_charges_are_fair,
    Do_you_feel_that_the_fees_are_a_barrier_to_care,
    At_todays_visit_did_someone_talk_to_you_about_your_health_or_dental_goals,
    At_todays_visit_were_you_asked_if_you_had_been_in_the_hospital_recently,
    //service_received_collection,
  };

  res.json(survey_analytics);
};

const retrieveSurveyByDateRange = async (req, res, next) => {
  const start_date = req.params.start_date;
  const end_date = req.params.end_date;

  // console.log(start_date)
  // console.log(end_date)

  Survey.find({ date_added: { $gte: start_date, $lte: end_date } })
    .then((survey) => {
      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Survey Retrieved", message);
      res.json(survey)

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const retrieveSurveyByDateRange2 = async (req, res, next) => {
  const start_date = req.params.start_date;
  const end_date = req.params.end_date;

  // console.log(start_date)
  // console.log(end_date)

  Survey2.find({ date_added: { $gte: start_date, $lte: end_date } })
    .then((survey) => {
      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Survey Retrieved", message);
      res.json(survey)

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const removeSurvey = async (req, res, next) => {
  const id = req.params.id;

  Survey.findByIdAndRemove(id)
    .then((survey) => {
      // message = {
      //   data: {
      //     survey: survey,
      //   },
      // };
      // handleResSuccess(res, res.statusCode, "Survey Content Deleted", message);
      res.json(survey)

    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving survey.",
      });
    });
};

const sendSurveyAccessMethod = async (req, res, next) => {
  const body = req.body;
  const date_added = moment().format("YYYY-MM-DD");
  const data = { ...body, date_added };

  try {
    const surveyAccessMethod = new SurveyAccessMethod(data);
    surveyAccessMethod.save((err, surveyAccessMethod) => {
      if (err) {
        handleResError(res, 30, err);
        return;
      }
      let response = {
         "message": "Data added Successfully",
         "data": data
     }
     console.log("SUCCESS", response)

     res.json(response)      
     
    });
  } catch (error) {
    (err = `Error: ${error}`), handleResError(res, 30, err);
  }
};

const surveyAccessMethodAnalytics = async (req, res, next) => {
  const current_date = moment().format('YYYY-MM-DD');
  const start_date = current_date;
  const end_date = current_date;
  
try {
  const total_survey = await SurveyAccessMethod.find({ date_added: { $gte: start_date, $lte: end_date } }).count();

  const true_count = await SurveyAccessMethod.find({ $and: [{ date_added: { $gte: start_date, $lte: end_date }}, {qrcode: true}]}).count();

  const false_count = await SurveyAccessMethod.find({ $and: [{ date_added: { $gte: start_date, $lte: end_date }}, {qrcode: false}]}).count();

   
     let response = {
        "total": total_survey,
        "true_count": true_count,
        "false_count":false_count
    }

    console.log("RESULT", response)

    res.json(response) 
   } catch (error) {
     (err = `Error: ${error}`), handleResError(res, 30, err);
   }
   
}

const getSurveyAccessMethodAnalyticsDateRange = async (req, res, next) => {
   const start_date = req.params.start_date;
   const end_date = req.params.end_date;

 try {
   const total_survey = await SurveyAccessMethod.find({ date_added: { $gte: start_date, $lte: end_date } }).count();

   const true_count = await SurveyAccessMethod.find({ $and: [{ date_added: { $gte: start_date, $lte: end_date }}, {qrcode: true}]}).count();

   const false_count = await SurveyAccessMethod.find({ $and: [{ date_added: { $gte: start_date, $lte: end_date }}, {qrcode: false}]}).count();

    
      let response = {
         "total": total_survey,
         "true_count": true_count,
         "false_count":false_count
     }

     console.log("RESULT", response)

     res.json(response) 
    } catch (error) {
      (err = `Error: ${error}`), handleResError(res, 30, err);
    }
    
 };




module.exports = {
  insertSurveyData,
  insertSurveyData2,
  retrieveAllRespondents,
  retrievePatientQuestionAndAnswer,
  retrievePatientSurveyQuestionAndAnswer,
  retrieveSurveyDataAnalytics,
  retrieveCurrentSortedSurveyDataAnalytics,
  retrieveCurrentSortedSurveyDataAnalytics2,
  retrieveSortedSurveyDataAnalytics,
  retrieveAllSurveys,
  retrieveSurveyByDateRange,
  retrieveSurveyByDateRange2,
  removeSurvey,
  sendSurveyAccessMethod,
  surveyAccessMethodAnalytics,
  getSurveyAccessMethodAnalyticsDateRange
};
