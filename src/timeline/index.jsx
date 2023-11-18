import {flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {buildColumns} from "./table_builder.jsx";
import {buildTimelineData} from "./timeline_builder.js";
import {timelines} from "../data/timeline/endwalker/index.js";
import useWebSocket from "react-use-websocket";
import CreateTimeline from "./modals/CreateTimeline.jsx";
import { applyPatch } from 'fast-json-patch';

const defaultSettings = {
    showHp: false,
}

const baseState = {
    timeline: null,
    timelineCustomizations: [],
    players: [],
    usages: [],
    settings: {}
}

const mockState = {
    timeline: 'p12sp2',
    timelineCustomizations: [],
    players: [
        {
            name: "Low Tide",
            job: 'whm',
            health: 74349, // TODO this is made up
            potencyMult: 30,
            level: 90,
            physicalDefense: 2032,
            magicalDefense: 3551,
        },
        {
            name: "Fjola Tachikake",
            job: 'sch',
            health: 74349,
            potencyMult: 30,
            level: 90,
            physicalDefense: 2032,
            magicalDefense: 3551,
        },
        {
            name: "Seela Bilen",
            job: 'gnb',
            subrole: "main-tank",
            health: 118241,
            potencyMult: 32.5, // TODO this is made up
            level: 90,
            physicalDefense: 5073,
            magicalDefense: 5073,
        },
        {
            name: "Kanrai Tachikake",
            job: 'sam',
            health: 82439, // 90336 with raid comp buffs and food
            potencyMult: 37.5,
            level: 90,
            physicalDefense: 2794, // without food or anything
            magicalDefense: 2794, // without food or anything
        },
        {
            name: "Goat",
            job: 'rpr',
            health: 83105,
            potencyMult: 37.5,
            level: 90,
            physicalDefense: 3551,
            magicalDefense: 2794
        }
    ],
    usages: [],
    settings: defaultSettings
}

const stateReducer = (state, {action, payload}) => {
    console.log(action, payload)
    switch (action) {
        case "load":
            return Object.assign({}, baseState, payload, { settings: {...defaultSettings, ...payload.settings } })
        case "update":
            return applyPatch(state, payload, true, false).newDocument;
        case "addAction":
            return {...state, usages: [...state.usages, { player: payload.player, id: payload.action, at: payload.at }]}
        case "clearAction":
            return {...state, usages: state.usages.filter(usage => (usage.at !== payload.at || usage.player !== payload.player || usage.id !== payload.action))}
    }
    console.warn(`Unknown action ${action}`, payload);
    return state;
}

const Timeline = () => {
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useReducer(stateReducer, {});
    const { sendJsonMessage, lastMessage } = useWebSocket(window.location.href.replace(/^http(s?)/, "ws$1"));
    useEffect(() => {
        if (lastMessage !== null) {
            console.log(lastMessage);
            const m = JSON.parse(lastMessage.data);
            dispatch(m);
            if (m.action === "load") {
                setLoading(false);
            }
        } else {
            sendJsonMessage({ action: "load", payload: {} });
        }
    }, [lastMessage, sendJsonMessage]);
    const resetState = () => sendJsonMessage({ action: "force_set", payload: state })

    const { players, settings, usages, timeline: timelineCode } = state;
    const syncDispatch = useCallback((m) => {
        sendJsonMessage(m);
        dispatch(m);
    }, [sendJsonMessage, dispatch]);

    console.log(state)
    const timeline = useMemo(() => timelines.find(tl => tl.shortName === timelineCode), [timelineCode]);
    const columns = useMemo(() => buildColumns(timeline?.longName, players, settings, syncDispatch), [timeline, players, syncDispatch, settings]);
    const data = useMemo(() => buildTimelineData(timeline?.timeline, players, usages, settings), [timeline, players, usages, settings]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    if (loading) return (<>
        Loading...
    </>);
    if (!timelineCode) return (<>
        <CreateTimeline dispatch={(m) => {
            resetState();
            syncDispatch(m);
        }} />
    </>);

    return (
        <main>
            <table>
                <thead>
                { table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                          <th key={header.id} colSpan={header.colSpan}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )
                              }
                          </th>
                      ))}
                  </tr>
                ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
        </main>
    )
};

export default Timeline;