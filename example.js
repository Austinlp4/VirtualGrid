



const Example = ({ segments }) => {
    let [thumbs, setThumbs] = useState({})

    useEffect(() => {
        const newThumbs = {};
        segments.map((segment, index) => {
            if (index !== segments.length - 1) {
                newThumbs[index] = segment.pos;
            }
        });
        setThumbs(newThumbs);
    }, [segments])

    return (
        <div>

        </div>
    )
}

const segments = [
    {
        color: 'red',
        pos: 0
    }, 
    {
        color: 'blue',
        pos: 25
    },
    {
        color: 'green',
        pos: 50
    },
    {
        color: 'yellow',
        pos: 75
    }
]

<Example segments={segments}/>