import {useForm, Controller} from "react-hook-form";
import {createPortal} from "react-dom";
import Select from "react-select";
import jobs from "../../data/jobs/index.js";
import {useState} from "react";

const selectStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "#242424", color: "white", width: "300px" }),
    option: (styles, { isDisabled }) => ({
        ...styles,
        backgroundColor: "#242424",
        color: isDisabled ? "gray" : "white",
        cursor: isDisabled ? "not-allowed" : "default"
    }),
    singleValue: (styles) => ({ ...styles, color: "white" })
};

const ChangePlayer = ({ id, current, dispatch, children }) => {
    const {
        handleSubmit,
        control,
        register,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: current
    });
    const [open, setOpen] = useState(false);

    const mapFormToPlayer = (data) => ({
        name: data.name,
        job: data.job.shortName || data.job,
        health: data.health,
        potencyMult: 30,
        level: data.level,
        physicalDefense: data.physicalDefense,
        magicalDefense: data.magicalDefense,
    })

    const onSubmit = (data) => {
        console.log(data)
        dispatch({
            action: "update",
            description: current ? "Update Player" : "Create Player",
            payload: [
                current
                    ? { op: "replace", path: `/players/${id}`, value: mapFormToPlayer(data) }
                    : { op: "add", path: `/players/${id}`, value: mapFormToPlayer(data) },
            ],
        });
        reset();
        setOpen(false);
    }

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>
            {open && createPortal(<>
                <div style={{ position: "fixed", left: 0, top: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: "rgba(36, 36, 36, 0.5)" }}>
                    <div style={{ position: "fixed", left: "50vw", top: "50vh", padding: "1.5rem", border: "solid 1px white", borderRadius: "1rem", transform: "translate(-50%, -50%)", backgroundColor: "#242424" }}>
                        <div role="button" style={{ position: "absolute", top: "0.5rem", right: "0.5rem"}} onClick={() => {
                            reset();
                            setOpen(false);
                        }}>X</div>
                        <h3 style={{marginTop: 0}}>{current ? "Edit" : "Create"} Player</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input type="text" {...register('name', {required: "A name is required."})} />
                                { errors.name && <div role="alert" style={{color: "red"}}>{errors.name.message}</div> }
                            </div>

                            { !current ?
                            <div>
                                <label htmlFor="job">Job</label>
                                <Controller
                                    control={control}
                                    name={"job"}
                                    rules={{ required: "You must select a job..." }}
                                    render={({ field: { onChange, value, ref }}) => (
                                        <Select
                                            inputRef={ref}
                                            options={Object.values(jobs)}
                                            value={value}
                                            onChange={val => onChange(val)}
                                            getOptionValue={opt => opt.shortName}
                                            getOptionLabel={opt => opt.longName}
                                            styles={selectStyles}
                                        />
                                    )}
                                />
                                { errors.job && <div role="alert" style={{color: "red"}}>{errors.job.message}</div> }
                            </div> : <input type="hidden" {...register('job')} />
                            }

                            <div>
                                <label htmlFor="level">Level</label>
                                <input type="number" {...register('level', {required: "Level is required.", pattern: /\d+/})} />
                                { errors.level && <div role="alert" style={{color: "red"}}>{errors.level.message}</div> }
                            </div>

                            <div>
                                <label htmlFor="health">Health</label>
                                <input type="number" {...register('health', {required: "Health is required.", pattern: /\d+/})} />
                                { errors.health && <div role="alert" style={{color: "red"}}>{errors.health.message}</div> }
                            </div>

                            <div>
                                <label htmlFor="physicalDefense">Physical Defense</label>
                                <input type="number" {...register('physicalDefense', {required: "Physical Defense is required.", pattern: /\d+/})} />
                                { errors.physicalDefense && <div role="alert" style={{color: "red"}}>{errors.physicalDefense.message}</div> }
                            </div>

                            <div>
                                <label htmlFor="magicalDefense">Magical Defense</label>
                                <input type="number" {...register('magicalDefense', {required: "Magical Defense is required.", pattern: /\d+/})} />
                                { errors.magicalDefense && <div role="alert" style={{color: "red"}}>{errors.magicalDefense.message}</div> }
                            </div>

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

export default ChangePlayer;