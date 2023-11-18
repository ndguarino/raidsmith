import ResourceCell from "./ResourceCell.jsx";
import jobs from "../data/jobs/index.js";
import ChangePlayer from "./modals/ChangePlayer.jsx";

const damageTypeMap = {
    "Physical": "https://xivapi.com/i/060000/060011.png",
    "Magic": "https://xivapi.com/i/060000/060012.png",
    "Unique": "https://xivapi.com/i/060000/060013.png",
};

const buildPlayerActionColumn = (action, id, settings, dispatch) => {
    return {
        header: () => (<img style={{height: "1.5rem"}} src={action.image} alt={action.name} title={action.name} />),
        accessorKey: `player${id}_${action.id}`,
        cell: ResourceCell,
        meta: { dispatch }
    }
}

const resourceColumnHeader = (resource) => {
    const ResourceColumnHeader = () => {
        return (<>
            {
                resource.image ?
                (<img src={resource.image} alt={resource.name} title={resource.name} />) :
                ([...Array(resource.max).fill(0).map((_, i) => (<img key={`${resource.id}${i}`} style={{height: "1rem"}} src={resource.onImage} alt={resource.name} title={resource.name} />))])
            }
        </>);
    }
    return ResourceColumnHeader;
}

const buildPlayerResourceColumn = (resource, id, settings, dispatch) => {
    return {
        header: resourceColumnHeader(resource),
        accessorKey: `player${id}_${resource.id}`,
        cell: ResourceCell,
        meta: { dispatch }
    }
}

const buildPlayerStatusColumns = (id, settings, dispatch) => {
    if (!settings.showHp) return [];
    return [
        {
            header: "HP",
            accessorKey: `player${id}_hp`,
            cell: ResourceCell,
            meta: { dispatch }
        }
    ];
}

const buildPlayerColumns = (player, id, settings, dispatch) => {
    return {
        header: (<>
            <ChangePlayer dispatch={dispatch} id={id} current={player}>
                {`${player.name} (${player.job})`}
            </ChangePlayer>
        </>),
        id: `player${id}`,
        columns: [
            ...buildPlayerStatusColumns(id, settings, dispatch),
            ...jobs[player.job].actions.map(action => buildPlayerActionColumn(action, id, settings, dispatch)),
            ...jobs[player.job].resources.map(resource => buildPlayerResourceColumn(resource, id, settings, dispatch))
        ]
    }
}
export const buildColumns = (timelineName, players, settings, dispatch) => {
    if (!timelineName) return [];

    let bossColumns = {
        header: timelineName,
        columns: [
            {
                header: "",
                accessorKey: "timeline_at",
                meta: { dispatch }
            },
            {
                header: (<>
                    <ChangePlayer dispatch={dispatch} id={players.length}>
                        Add Player
                    </ChangePlayer>
                </>),
                accessorKey: "timeline_name",
                meta: { dispatch }
            },
            {
                header: "",
                accessorKey: "timeline_type",
                cell: ({getValue}) => {
                    const type = getValue();
                    const imgSrc = damageTypeMap[type];
                    return (<img style={{height: "0.8rem"}} src={imgSrc} alt={type} title={type} />);
                },
                meta: { dispatch }
            },
            {
                header: "",
                accessorKey: "timeline_damage",
                meta: { dispatch }
            }
        ],
        meta: { dispatch }
    };

    return [bossColumns, ...players.map((player, idx) => buildPlayerColumns(player, idx, settings, dispatch))];
}