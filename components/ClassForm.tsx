"use client";
import React, { useEffect, useState, MouseEvent, FormEvent } from "react";
import { DateTime, ToObjectOutput } from "luxon";
import { faTrashCan, faLock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, TextField, Popper, Switch, FormControlLabel } from "@mui/material";
import { ClassI } from "@/lib/data/types";
import { getTimeOptions } from "@/lib/date";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Coach, Student, Location } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface ClassFormInputs {
  startTime: Date;
  endTime: Date;
  coach: Coach;
  students: Student[];
  location: Location;
  courtId: number;
  note?: string;
  isLeave: boolean;
}

export interface ClassFormProps {
  day?: number;
  quarterHour: number;
  toggleForm: () => void;
  classTimeTarget?: ClassI;
}

export default function ClassForm({ day, quarterHour, toggleForm, classTimeTarget }: ClassFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentDate, startOfWeek } = useAppSelector((state) => state.dates);
  const { calendarView, coach, coachData, location, locationData, glowState } = useAppSelector((state) => state.views);

  const [timeOptions, setTimeOptions] = useState<string[]>();
  const [coachOptions, setCoachOptions] = useState<Coach[]>();
  const [studentOptions, setStudentOptions] = useState<Student[]>();
  const [locationOptions, setLocationOptions] = useState<Location[]>();
  const [inputDate, setInputDate] = useState({
    startDate: "",
    endDate: "",
    startTimeString: "",
    endTimeString: "",
  });
  // const [inputs, setInputs] = useState<ClassFormInputs>({
  //   startTime: new Date(),
  //   endTime: new Date(),
  //   coach: 0,
  //   students: [],
  //   locationId: 0,
  //   courtId: 0,
  //   isLeave: false,
  // });
  const [inputs, setInputs] = useState<ClassFormInputs>({} as ClassFormInputs);

  useEffect(() => {
    (async () => {
      const { data: studentOptions } = await axios.get("api/student/options");
      const timeOptions = getTimeOptions();
      setStudentOptions(studentOptions);
      setTimeOptions(timeOptions);
    })();
  }, []);

  let dateObj: DateTime;
  let startDateTime: DateTime;
  let endDateTime: DateTime;
  let startTimeString: string;
  let endTimeString: string;

  const hour = Math.floor((quarterHour - 1) / 4 + 7);
  const min = ((quarterHour - 1) % 4) * 15;

  if (classTimeTarget) {
    const { startTime, endTime } = classTimeTarget;
    startDateTime = DateTime.fromJSDate(startTime);
    endDateTime = DateTime.fromJSDate(endTime);
  } else if (startOfWeek && day) {
    dateObj = DateTime.fromObject(startOfWeek);
    startDateTime = dateObj.plus({ days: day - 1, hours: hour, minutes: min });
    endDateTime = dateObj.plus({ days: day - 1, hours: hour + 1, minutes: min });
  } else if (currentDate && !day) {
    dateObj = DateTime.fromObject(currentDate);
    startDateTime = dateObj.set({ hour: hour, minute: min });
    endDateTime = dateObj.set({ hour: hour + 1, minute: min });
  }
  startTimeString = startDateTime!.toFormat("h:mm a").toLowerCase();
  endTimeString = endDateTime!.toFormat("h:mm a").toLowerCase();

  useEffect(() => {
    if (startOfWeek || currentDate) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        startTime: startDateTime.toJSDate(),
        endTime: endDateTime.toJSDate(),
      }));
    }
  }, [startOfWeek, currentDate]);

  useEffect(() => {
    if (startTimeString.length > 5) {
      setInputDate({
        startDate: startDateTime.toLocaleString(DateTime.DATE_SHORT),
        endDate: endDateTime.toLocaleString(DateTime.DATE_SHORT),
        startTimeString: startTimeString,
        endTimeString: endTimeString,
      });
    }
  }, []); // maybe add startDateTime //

  useEffect(() => {
    if (classTimeTarget) {
      const { startTime, endTime, students, coach, location, courtId, note, isLeave } = classTimeTarget;
      setInputs({
        startTime,
        endTime,
        coach,
        students,
        location,
        courtId,
        note: note || undefined,
        isLeave: isLeave,
      });
    }
  }, [classTimeTarget]); // maybe take away dependencies //

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!classTimeTarget) return;

    try {
      await axios.delete(`/api/class?id=${classTimeTarget.id}`);

      toggleForm();
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let method, body;
    if (classTimeTarget) {
      method = "put";
      body = { ...inputs, id: classTimeTarget.id };
    } else {
      method = "post";
      body = inputs;
    }

    try {
      await fetch("/api/class", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      toggleForm();
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (inputDate.startDate) {
      const { startDate, endDate, startTimeString, endTimeString } = inputDate;
      const format = "dd/MM/yyyy h:mm a";
      const startTime = DateTime.fromFormat(`${startDate} ${startTimeString}`, format).toJSDate();
      const endTime = DateTime.fromFormat(`${endDate} ${endTimeString}`, format).toJSDate();

      setInputs((prev) => ({
        ...prev,
        startTime: startTime,
        endTime: endTime,
      }));
    }
  }, [inputDate]);

  // let coachOptions;
  // let locationOptions;
  // let courtNoOptions = [];
  // if (coachData) coachOptions = coachData.slice(1).map((coach) => coach.name);
  // if (locationData) locationOptions = locationData.slice(1).map((location) => location.name);
  // if (inputs.location.name === "Camberwell") courtNoOptions = ["1", "2", "3", "4", "5"];
  // else courtNoOptions = ["1", "2"];

  const popStyle = {
    boxShadow: "0 0 1rem 0 rgba(0, 0, 0, 0.2)",
    "& .MuiAutocomplete-listbox": {
      "& li": {
        padding: "1px 0px 1px 10px",
      },
    },
  };

  const dateStyle = {
    "& .MuiFilledInput-root": {
      borderRadius: "0",
      borderTopLeftRadius: "0.4em",
      borderBottomLeftRadius: "0.4em",
      "& .MuiFilledInput-input": {
        paddingRight: "0px",
      },
    },
  };

  const timeStyle = {
    "& .MuiTextField-root": {
      "& .MuiFilledInput-root": {
        borderRadius: "0",
        borderTopRightRadius: "0.4em",
        borderBottomRightRadius: "0.4em",
      },
    },
  };

  return (
    <div className="form-container">
      <form className="class-form" onSubmit={(e) => handleSubmit}>
        <div className="form-time">
          <div className="form-time-start">
            <TextField
              label="Start"
              name="startDate"
              value={inputDate.startDate}
              onChange={(e) =>
                setInputDate((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              variant="filled"
              size="small"
              sx={dateStyle}
            />
            <Autocomplete
              options={timeOptions?.slice(0, 64) || []}
              // renderInput={(params) => textInput(params, "")}
              renderInput={(params) => <TextField {...params} variant="filled" />}
              PopperComponent={(props) => <Popper {...props} sx={popStyle} style={{ width: "85px" }} />}
              value={inputDate.startTimeString}
              onChange={(e, value) =>
                setInputDate((prev) => ({
                  ...prev,
                  startTimeString: value || "",
                }))
              }
              size="small"
              autoHighlight
              popupIcon={null}
              sx={timeStyle}
            />
          </div>
          <div className="form-time-end">
            <TextField
              label="End"
              name="endDate"
              value={inputDate.endDate}
              onChange={(e) =>
                setInputDate((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              variant="filled"
              size="small"
              sx={dateStyle}
            />
            <Autocomplete
              options={timeOptions?.slice(1) || []}
              renderInput={(params) => <TextField {...params} variant="filled" />}
              PopperComponent={(props) => <Popper {...props} sx={popStyle} style={{ width: "85px" }} />}
              value={inputDate.endTimeString}
              onChange={(e, value) =>
                setInputDate((prev) => ({
                  ...prev,
                  endTimeString: value || "",
                }))
              }
              size="small"
              autoHighlight
              popupIcon={null}
              sx={timeStyle}
            />
          </div>
        </div>
        <Autocomplete
          options={studentOptions || []}
          renderInput={(params) => <TextField {...params} label="Student" variant="filled" />}
          value={inputs.students}
          onChange={(e, values) =>
            setInputs((prev) => ({
              ...prev,
              students: values,
            }))
          }
          size="small"
          autoHighlight
          multiple
        />
        <Autocomplete
          options={coachOptions || []}
          // isOptionEqualToValue={(option, value) => true}
          renderInput={(params) => <TextField {...params} label="Coach" variant="filled" />}
          value={inputs.coach}
          onChange={(e, value) =>
            setInputs((prev) => ({
              ...prev,
              ...(value && { coach: value }),
            }))
          }
          size="small"
          autoHighlight
        />
        <div className="form-location">
          <Autocomplete
            options={locationOptions || []}
            // isOptionEqualToValue={(option, value) => true}
            renderInput={(params) => <TextField {...params} label="Location" variant="filled" />}
            value={inputs.location}
            onChange={(e, value) =>
              setInputs((prev) => ({
                ...prev,
                ...(value && { location: value }),
              }))
            }
            size="small"
            autoHighlight
          />
          <Autocomplete
            options={location ? [...Array(location.courtCount)].map((v, i) => i + 1) : []}
            getOptionLabel={(option) => option.toString()}
            // isOptionEqualToValue={(option, value) => true}
            renderInput={(params) => <TextField {...params} label="Court No." variant="filled" />}
            value={inputs.courtId}
            onChange={(e, value) =>
              setInputs((prev) => ({
                ...prev,
                ...(value && { courtId: value }),
              }))
            }
            size="small"
            autoHighlight
          />
        </div>
        <TextField
          label="Note"
          name="note"
          value={inputs.note}
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              [e.target.name]: e.target.value,
            }))
          }
          variant="filled"
          multiline={true}
          size="small"
          rows={2}
        />
        <FormControlLabel
          control={
            <Switch
              checked={inputs.isLeave}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  isLeave: e.target.checked,
                }))
              }
              color="default"
              // sx={{ marginLeft: 'auto' }}
            />
          }
          label={<FontAwesomeIcon icon={inputs.isLeave ? faLock : faUnlockKeyhole} />}
        />
        <div className="form-button-group">
          <button
            className="form-cancel-button"
            onClick={(e) => {
              e.preventDefault();
              toggleForm();
            }}>
            Cancel
          </button>
          {classTimeTarget && (
            <button className="form-delete-button" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          )}
          <button type="submit" className="form-submit-button">
            {classTimeTarget ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
