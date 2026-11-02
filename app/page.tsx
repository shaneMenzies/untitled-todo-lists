import CoolList from './cool-list';

function CoolThing(props) {
    return <h2>{'text' in props ? props.text : 'This is a cool thing'}</h2>;
}

export default function Home() {
    return (<CoolList />);
}
