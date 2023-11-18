import chroma from 'chroma-js';

// eslint-disable-next-line react/prop-types
const GaugeCell = ({...args}) => {
    const { current, max, colorGradient, overflowColor } = args;
    const currentPct = Math.min(current, max)/max;
    const overflowTicks = (current > max) ? (Math.floor(current/max)-2) : 0;
    const overflowPct = (current > max) ? (current % max) / max : 0
    const color = chroma.scale(colorGradient)(currentPct);

    return (
        <div style={{position: "relative", color: "transparent"}}>
            <div style={{position: "absolute", top: 0, bottom: 0, left: 0, width: `${currentPct*100}%`, backgroundColor: color }} />
            {
                (overflowPct > 0) ?
                    (<div style={{position: "absolute", bottom: 0, left: 0, top: "66%", width: `${overflowPct*100}%`, backgroundColor: overflowColor, borderTop: "solid 1px black"}}  />) :
                    null
            }
            {
                (overflowTicks > 0) ?
                    Array(overflowTicks).fill(0).map((_, i) => (<div key={i} style={{position: "absolute", backgroundColor: overflowColor, top: "33%", bottom: "33%", width: 12, left: i*12, border: "solid 1px black" }} />)) :
                    null
            }
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
    )
}

// eslint-disable-next-line react/prop-types
const ImplResourceCell = ({offImage, onImage, current, max}) => {
    return (
        <>
            {Array(max).fill(0).map((_,i) => (<img key={i} src={current>i ? onImage : offImage} style={{height: "1rem"}} />))}
        </>
    )
}

// eslint-disable-next-line react/prop-types
const ActionCellImpl = ({image, state}) => {
    if (state === 0) return (<>&nbsp;</>);
    if (state === 1) return (<>
        <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: "repeating-linear-gradient(45deg, hsl(120 50% 50%), hsl(120 50% 50%) 0.5rem, hsl(120 50% 70%) 0.5rem, hsl(120 50% 70%) 1rem)" }} />
        &nbsp;
    </>);
    if (state === 2) return (<>
        <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0,background: "repeating-linear-gradient(90deg, hsl(0 50% 50%), hsl(0 50% 50%) 0.5rem, hsl(0 50% 70%) 0.5rem, hsl(0 50% 70%) 1rem)" }} />
        &nbsp;
    </>);
    if (state === -1) return (<>
        <div style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: "repeating-linear-gradient(-45deg, hsla(0 100% 100% / 10%), hsla(0 100% 100% / 10%) 0.5rem, hsla(0 100% 100% / 20%) 0.5rem, hsla(0 100% 100% / 20%) 1rem)" }} />
        &nbsp;
    </>);
    if (state === 3) return (<img src={image} style={{height: "1.5rem", display: "block"}} />)

    console.warn("Unknown state for action")
    return (<>&nbsp;</>);
}

// eslint-disable-next-line react/prop-types
const ActionCell = ({state, dispatch, id, player, at, usage, ...props}) => {
    const onClick = () => {
        if (state === 0) dispatch({
            action: "update",
            payload: [
                { op: "add", path: `/usages/${usage}`, value: { player: player, id: id, at: at }}
            ],
            description: "Add action"
        });
        if (state === 3) dispatch({
            action: "update",
            description: "Remove Action",
            payload: [
                {op: "remove", path: `/usages/${usage}`}
            ]
        });
    }

    return (
        <div style={{position: "relative"}} onClick={onClick}>
            <ActionCellImpl state={state} {...props} />
        </div>
    )
}

// eslint-disable-next-line react/prop-types
const ResourceCell = ({ getValue, column }) => {
    // eslint-disable-next-line react/prop-types
    const value = getValue();
    const type = value.type;
    const dispatch = column.columnDef.meta?.dispatch || (() => {});

    if (type === "gauge") return (<GaugeCell {...value} dispatch={dispatch} />)
    if (type === "resource") return (<ImplResourceCell {...value} dispatch={dispatch} />);
    if (type === "action") return (<ActionCell {...value} dispatch={dispatch} />)
    return null;
}

export default ResourceCell;