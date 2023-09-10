"use client";
import React, { useEffect, useState, MouseEvent, FormEvent, HTMLAttributes } from "react";
import { DateTime } from "luxon";
import { faTrashCan, faLock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Autocomplete,
  TextField,
  Popper,
  Switch,
  FormControlLabel,
  Chip,
  AutocompleteRenderGetTagProps,
} from "@mui/material";
import { ClassI, CoachI, LocationI } from "@/lib/data/types";
import { getTimeOptions } from "@/lib/date";
import { useAppSelector } from "@/redux/store";
import { ClassType, Student } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { convertFormInputs, parseClassType } from "@/lib/utils";

export interface ClassFormInputs {
  type: ClassType;
  startTime: number;
  endTime: number;
  coach: CoachI;
  students: Student[];
  location: LocationI;
  courtId: number;
  note?: string;
  isBreak: boolean;
}

export interface ClassFormProps {
  day?: number;
  quarterHour: number;
  toggleForm: () => void;
  classTimeTarget?: ClassI;
}

const classTypes: ClassType[] = [
  ClassType.ADULT_PRIVATE,
  ClassType.ADULT_GROUP,
  ClassType.YOUNG_PRIVATE,
  ClassType.YOUNG_GROUP,
  ClassType.TRAINING,
];

const DEFAULT_CLASS_FORM: ClassFormInputs = {
  type: classTypes[0],
  startTime: 0,
  endTime: 0,
  coach: {
    id: "",
    name: "",
    payRate: null,
    students: [],
    classes: [],
  },
  students: [],
  location: {
    id: "",
    key: "",
    name: "",
    courtCount: 0,
    classes: [],
  },
  courtId: 1,
  note: "",
  isBreak: false,
};

export default function ClassForm({ day, quarterHour, toggleForm, classTimeTarget }: ClassFormProps) {
  const router = useRouter();
  const { currentDate, startOfWeek } = useAppSelector((state) => state.dates);
  const { coachData, locationData } = useAppSelector((state) => state.views);

  const [timeOptions, setTimeOptions] = useState<string[]>();
  const [studentOptions, setStudentOptions] = useState<Student[]>();
  const [inputDate, setInputDate] = useState({
    startDate: "",
    endDate: "",
    startTimeString: "",
    endTimeString: "",
  });
  const [inputs, setInputs] = useState<ClassFormInputs>(DEFAULT_CLASS_FORM);

  useEffect(() => {
    (async () => {
      const { data: studentOptions } = await axios.get("/api/student/options");
      const timeOptions = getTimeOptions();
      setStudentOptions(studentOptions);
      setTimeOptions(timeOptions);
    })();
  }, []);

  let dateObj: DateTime | undefined = undefined;
  let startDateTime: DateTime | undefined = undefined;
  let endDateTime: DateTime | undefined = undefined;
  let startTimeString: string | undefined = undefined;
  let endTimeString: string | undefined = undefined;

  const hour = Math.floor((quarterHour - 1) / 4 + 7);
  const min = ((quarterHour - 1) % 4) * 15;

  if (classTimeTarget) {
    const { startTime, endTime } = classTimeTarget;
    startDateTime = DateTime.fromMillis(startTime);
    endDateTime = DateTime.fromMillis(endTime);
  } else if (startOfWeek && day) {
    dateObj = DateTime.fromObject(startOfWeek);
    startDateTime = dateObj.plus({ days: day - 1, hours: hour, minutes: min });
    endDateTime = dateObj.plus({ days: day - 1, hours: hour + 1, minutes: min });
  } else if (currentDate && !day) {
    dateObj = DateTime.fromObject(currentDate);
    startDateTime = dateObj.set({ hour: hour, minute: min });
    endDateTime = dateObj.set({ hour: hour + 1, minute: min });
  }
  startTimeString = startDateTime?.toFormat("h:mm a").toLowerCase();
  endTimeString = endDateTime?.toFormat("h:mm a").toLowerCase();

  useEffect(() => {
    if (!startDateTime || !endDateTime || !startTimeString || !endTimeString) return;

    setInputDate({
      startDate: startDateTime.toLocaleString(DateTime.DATE_SHORT),
      endDate: endDateTime.toLocaleString(DateTime.DATE_SHORT),
      startTimeString: startTimeString,
      endTimeString: endTimeString,
    });

    if (classTimeTarget) {
      const { type, startTime, endTime, students, coach, location, courtId, note, isBreak } = classTimeTarget;
      setInputs({
        type,
        startTime,
        endTime,
        coach,
        students,
        location,
        courtId,
        note: note || undefined,
        isBreak,
      });
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        startTime: startDateTime?.toMillis() || 0,
        endTime: endDateTime?.toMillis() || 0,
      }));
    }
  }, []);

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

    const method = classTimeTarget ? "put" : "post";
    const body = convertFormInputs(inputs, classTimeTarget?.id);

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
      const startTime = DateTime.fromFormat(`${startDate} ${startTimeString}`, format).toMillis();
      const endTime = DateTime.fromFormat(`${endDate} ${endTimeString}`, format).toMillis();

      setInputs((prev) => ({
        ...prev,
        startTime: startTime,
        endTime: endTime,
      }));
    }
  }, [inputDate]);

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
      <form className="class-form" onSubmit={(e) => handleSubmit(e)}>
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
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} />)
              }
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
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} />)
              }
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

        <div className="form-double">
          <Autocomplete
            options={classTypes}
            isOptionEqualToValue={(option, value) => true}
            getOptionLabel={(option: ClassType) => parseClassType(option)}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option) => (
              <li {...props} key={option}>
                {parseClassType(option)}
              </li>
            )}
            renderTags={(tagValue, getTagProps: AutocompleteRenderGetTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={parseClassType(option)} />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Class Type" variant="filled" />}
            value={inputs.type}
            onChange={(e, value) =>
              setInputs((prev) => ({
                ...prev,
                ...(value && { type: value }),
              }))
            }
            size="small"
            autoHighlight
          />
          <Autocomplete
            options={coachData || []}
            isOptionEqualToValue={(option, value) => true}
            getOptionLabel={(option: CoachI) => option.name}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            renderTags={(tagValue, getTagProps: AutocompleteRenderGetTagProps) =>
              tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.name} />)
            }
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
        </div>
        <Autocomplete
          options={studentOptions || []}
          getOptionLabel={(option) => option.name}
          renderOption={(props: HTMLAttributes<HTMLLIElement>, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          renderTags={(tagValue, getTagProps: AutocompleteRenderGetTagProps) =>
            tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.name} />)
          }
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
        <div className="form-double">
          <Autocomplete
            options={locationData || []}
            isOptionEqualToValue={(option, value) => true}
            getOptionLabel={(option: LocationI) => option.name}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            renderTags={(tagValue, getTagProps: AutocompleteRenderGetTagProps) =>
              tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option.id} label={option.name} />)
            }
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
            options={inputs.location ? [...Array(inputs.location.courtCount)].map((v, i) => i + 1) : []}
            getOptionLabel={(option) => option.toString()}
            isOptionEqualToValue={(option, value) => true}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(tagValue, getTagProps: AutocompleteRenderGetTagProps) =>
              tagValue.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} />)
            }
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
              checked={inputs.isBreak}
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
          label={<FontAwesomeIcon icon={inputs.isBreak ? faLock : faUnlockKeyhole} />}
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
