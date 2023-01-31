import { useEffect, useState } from 'react';
import { query, orderBy, limit, doc, setDoc, getDocs, deleteDoc, DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";
import { getAuth, User, signOut } from "firebase/auth";
import { CollectionVersao, CollectionSincronizacaoAutomatica } from '../db/collections';
import { sync } from '../db/sync';
import { Button } from '../components/Button';
import { CircularProgressMain } from '../components/CircularProgressMain';
import { Accordion, Card, Image, Offcanvas } from 'react-bootstrap';
import { ArrowsClockwise, ClockClockwise, List, SignOut as SignOutIcon, UserGear } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';
import { Loading } from "../screens/Loading"
import 'react-circular-progressbar/dist/styles.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import moment, { Moment } from 'moment';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TimePickerItem } from '../components/TimePickerItem';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export function Home() {
    const [isSync, setIsSync] = useState(false);
    const [collectionPercent, setCollectionPercent] = useState(0);
    const [documentPercent, setDocumentPercent] = useState(0);
    const [collectionId, setCollectionId] = useState('');
    const [lastSyncDate, setLastSyncDate] = useState();
    const [lastSyncTime, setLastSyncTime] = useState();
    const [show, setShow] = useState(false);
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(false);
    const [time, setTime] = useState<(Moment | null)[]>([]);
    const [versoes, setVersoes] = useState<DocumentData[]>([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();

    const getDateFromDocument = ((Document: DocumentData) => {
        return Document.data().datahora.toDate();
    });

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setIsSync(true);

        setDocumentPercent(0);
        setCollectionPercent(0);

        sync((
            colPercent,
            docPercent,
            colId
        ) => {
            setCollectionId(colId);
            setDocumentPercent(docPercent);

            if (docPercent === 100) {
                setCollectionPercent(colPercent);

                if (colPercent === 100) {
                    setIsSync(false);

                    setTimeout(() => {
                        setDocumentPercent(0);
                        setCollectionPercent(0);
                    }, 5000);
                }
            }
        });
    };

    const handleClickSignOut = (event: React.MouseEvent<HTMLElement>) => {
        setIsLoading(true);

        signOut(getAuth())
            .then(() => {
                setIsLoading(false);
                navigate('/login');
            });
    }

    const updateCron = () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}`);
    };

    const handleChange = (value: Moment | null, index: number, updateDb: boolean = true) => {
        let timer: (Moment | null)[] = [];

        timer = timer.concat(time);

        timer[index] = value;

        setTime(timer);

        if (updateDb) {
            if (value) {
                let Date = value.toDate();

                if (!isNaN(Date.getTime())) {
                    setDoc(doc(CollectionSincronizacaoAutomatica.firestore, CollectionSincronizacaoAutomatica.id, index.toString()), {
                        hora: Timestamp.fromDate(Date)
                    })
                        .then(() => {
                            updateCron();
                        });
                }
                else {
                    deleteDoc(doc(CollectionSincronizacaoAutomatica.firestore, CollectionSincronizacaoAutomatica.id, index.toString()))
                        .then(() => {
                            updateCron();
                        });
                }
            }
            else {
                deleteDoc(doc(CollectionSincronizacaoAutomatica.firestore, CollectionSincronizacaoAutomatica.id, index.toString()))
                    .then(() => {
                        updateCron();
                    });
            }
        }
    }

    const handleDelete = (index: number) => {
        let timer: (Moment | null)[] = [];

        timer = timer.concat(time);

        //timer.splice(index, 1);
        delete timer[index];

        setTime(timer);

        deleteDoc(doc(CollectionSincronizacaoAutomatica.firestore, CollectionSincronizacaoAutomatica.id, index.toString()))
            .then(() => {
                updateCron();
            });
    }

    const newTimePickerItem = (index: number, type: 'plus' | 'minus', value: (Moment | null)) => {
        if (time[index] === undefined) {
            handleChange(null, (index), false);
        }

        return (
            <TimePickerItem
                key={index.toString()}
                type={type}
                value={value}
                renderInput={(params) => <TextField {...params} />}
                onChange={(newValue) => {
                    handleChange(newValue, index);
                }}
                onClickPlus={(e) => {
                    handleChange(null, (time.length));
                }}
                onClickMinus={(e) => {
                    handleDelete(index);
                }}
            />
        );
    }

    const getFirstTimePickerItem = () => {
        let timeKeysString = Object.keys(time);
        let timeKeysNumber: number[] = [];

        if (timeKeysString) {
            timeKeysString.forEach((key: string) => {
                timeKeysNumber.push(Number(key));
            });
        }

        return Math.min(...timeKeysNumber);
    }

    useEffect(() => {
        const queryVersao = query(CollectionVersao, orderBy("datahora", "desc"), limit(20));

        getDocs(queryVersao)
            .then((Documents: QuerySnapshot<DocumentData>) => {
                let documents: DocumentData[] = [];

                Documents.forEach((Document: DocumentData) => {
                    documents.push(Document);
                });

                setVersoes(documents);

                if (documents) {
                    let firstDocument = documents[0];

                    if (firstDocument) {
                        let Date = getDateFromDocument(firstDocument);

                        setLastSyncDate(Date.toLocaleDateString());
                        setLastSyncTime(Date.toLocaleTimeString());
                    }
                }
            });

        const querySincronizacaoAutomatica = query(CollectionSincronizacaoAutomatica, orderBy("hora", "asc"));

        getDocs(querySincronizacaoAutomatica)
            .then((Documents: QuerySnapshot<DocumentData>) => {
                let moments: Moment[] = [];

                Documents.forEach((Document: DocumentData) => {
                    moments[Document.id] = moment(Document.data().hora.toDate());
                });

                setTime(moments);
            });


        const currentUser = getAuth().currentUser;

        if (currentUser) {
            setUser(currentUser);
        }

    }, [isSync]);

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        )
    }

    return (
        <>
            <div
                className="container-fluid d-flex flex-column text-white"
                style={{
                    height: '100vh',
                    backgroundColor: '#161927'
                }}
            >
                <List
                    className='mt-2 mb-2'
                    size={32}
                    color={'#0d6efd'}
                    onClick={handleShow}
                    style={{
                        cursor: 'pointer'
                    }}
                />
                <Offcanvas
                    className='text-white'
                    show={show}
                    onHide={handleClose}
                    style={{
                        backgroundColor: '#161927'
                    }}
                >
                    <Offcanvas.Header
                        closeButton={true}
                        closeVariant='white'
                    >
                        <Offcanvas.Title>
                            <UserGear
                                size={32}
                                color={'#0d6efd'}
                            /> {user ? user.email : 'Usuário não encontrado'}
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Accordion
                            defaultActiveKey="0"
                            flush
                        >
                            <Accordion.Item
                                eventKey="0"
                            >
                                <Accordion.Header>
                                    <span
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <ArrowsClockwise
                                            size={25}
                                            color={'#0d6efd'}
                                        /> Sincronização Automática
                                    </span>
                                </Accordion.Header>
                                <Accordion.Body
                                    style={{
                                        backgroundColor: '#161927'
                                    }}
                                >
                                    <center
                                        className='mt-3'
                                    >
                                        <ThemeProvider
                                            theme={darkTheme}
                                        >
                                            <LocalizationProvider
                                                dateAdapter={AdapterMoment}
                                            >
                                                {time.length > 0 ?
                                                    time.map((value: (Moment | null), index: number) => (
                                                        newTimePickerItem(index, ((index === getFirstTimePickerItem()) ? 'plus' : 'minus'), value)
                                                    )) :
                                                    newTimePickerItem(1, 'plus', null)
                                                }
                                            </LocalizationProvider>
                                        </ThemeProvider>
                                    </center>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item
                                eventKey="1"
                            >
                                <Accordion.Header>
                                    <span
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <ClockClockwise
                                            size={25}
                                            color={'#0d6efd'}
                                        /> Histórico
                                    </span>
                                </Accordion.Header>
                                <Accordion.Body
                                    style={{
                                        backgroundColor: '#161927'
                                    }}
                                >
                                    <center
                                        className='mt-2 text-white'
                                    >
                                        {versoes.length > 0 ?
                                            versoes.map((Document: DocumentData, index: number) => (
                                                <span key={index.toString()}>
                                                    {getDateFromDocument(Document).toLocaleDateString()} às {getDateFromDocument(Document).toLocaleTimeString()}<br />
                                                </span>
                                            )) : <span>Nenhum histórico</span>
                                        }
                                    </center>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Offcanvas.Body>
                    <Card
                        className='fixed-bottom position-absolute'
                        style={{
                            backgroundColor: '#161927'
                        }}
                    >
                        <Card.Header>
                            <span
                                onClick={handleClickSignOut}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                <SignOutIcon
                                    size={25}
                                    color={'#0d6efd'}
                                /> Sair
                            </span>
                        </Card.Header>
                    </Card>
                </Offcanvas>
                <div
                    className="d-flex justify-content-center align-items-center flex-column gap-5"
                    style={{
                        flexGrow: 1,
                        flexBasis: 'auto'
                    }}
                >
                    <div
                        className='d-flex justify-content-center align-items-center flex-column gap-5'
                    >
                        <div
                            style={{
                                width: 250,
                                height: 250
                            }}
                        >
                            <CircularProgressMain
                                value={collectionPercent}
                                valueChildren={documentPercent}
                            />
                        </div>
                        <Button
                            title="Sincronizar agora"
                            variant="primary"
                            size="lg"
                            onClick={handleClick}
                            isLoading={isSync}
                        />
                        {!isSync &&
                            <center>Última sincronização: <br /> {lastSyncDate} às {lastSyncTime}</center>
                        }
                        {!!isSync &&
                            <center>Sincronizando... <br /> {collectionId}</center>
                        }
                    </div>
                    <Image
                        src={'/assets/img/mtr-logo.png'}
                        style={{
                            width: '80px',
                        }}
                    />
                </div>
            </div>
        </>
    );
}