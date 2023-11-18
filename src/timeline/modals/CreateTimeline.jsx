import {useForm, Controller} from "react-hook-form";
import {createPortal} from "react-dom";
import Select from "react-select";
import timelines from "../../data/timeline/index.js";

const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "#242424", color: "white", width: "300px" }),
    option: (styles, { isDisabled }) => ({
        ...styles,
        backgroundColor: "#242424",
        color: isDisabled ? "gray" : "white",
        cursor: isDisabled ? "not-allowed" : "default"
    }),
    singleValue: (styles) => ({ ...styles, color: "white" })
};

const CreateTimeline = ({ dispatch }) => {
    const {
        handleSubmit,
        control,
        formState: {errors}
    } = useForm();

    const onSubmit = (data) => dispatch({
        action: "update",
        description: "Set timeline",
        payload: [
            { op: "replace", path: "/timeline", value: data.timeline.shortName }
        ],
    });

    return (
        <>
            {createPortal(<>
                <div style={{ position: "fixed", left: 0, top: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: "rgba(36, 36, 36, 0.5)" }}>
                    <div style={{ position: "fixed", left: "50vw", top: "50vh", padding: "1.5rem", border: "solid 1px white", borderRadius: "1rem", transform: "translate(-50%, -50%)", backgroundColor: "#242424" }}>
                        <h3 style={{marginTop: 0}}>Select a Timeline</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            { errors.timeline && <p role="alert" style={{color: "red"}}>{errors.timeline.message}</p> }
                            <Controller
                                control={control}
                                name={"timeline"}
                                rules={{ required: "You must select a timeline..." }}
                                render={({ field: { onChange, value, ref }}) => (
                                    <Select
                                        inputRef={ref}
                                        options={timelines}
                                        value={value}
                                        onChange={val => onChange(val)}
                                        getOptionValue={opt => opt.shortName}
                                        getOptionLabel={opt => opt.longName}
                                        isOptionDisabled={opt => opt.timelineType === "Category"}
                                        styles={colourStyles}
                                    />
                                )}
                            />
                            <input type="submit" style={{
                                backgroundColor: "#242424",
                                fontSize: "1rem",
                                border: "solid 1px white",
                                borderRadius: "0.2rem",
                                padding: "0.5rem",
                                marginTop: "0.5rem"
                            }} />
                        </form>
                    </div>
                </div>
            </>, document.body)}
        </>
    )
}

export default CreateTimeline;