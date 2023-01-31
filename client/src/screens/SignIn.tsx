import { useState } from 'react';
import { Form, FloatingLabel, Image, Col } from 'react-bootstrap';
import { Button } from '../components/Button';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ArrowsClockwise } from 'phosphor-react';
import { Toast, ToastContainer } from 'react-bootstrap';

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const toggleShow = () => setShow(!show);

    const handleSubmit = (e: any) => {
        const form = e.currentTarget;

        e.preventDefault();
        e.stopPropagation();

        if (form.checkValidity()) {
            setIsLoading(true);

            signInWithEmailAndPassword(getAuth(), email, password)
                .then(() => {
                    setIsLoading(false);
                    navigate('/home');
                })
                .catch((error) => {
                    setIsLoading(false);

                    switch (error.code) {
                        case 'auth/invalid-email':
                            setMessage('Email inválido.')
                            break;
                        case 'auth/wrong-password':
                            setMessage('Email ou senha inválidos.');
                            break;
                        case 'auth/user-not-found':
                            setMessage('Email ou senha inválidos.');
                            break;
                        default:
                            setMessage('Ocorreu um problema. Tente novamente mais tarde.');
                            break;
                    }

                    setShow(true);
                });
        }

        setValidated(true);
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center flex-column gap-5"
            style={{
                height: '100vh',
                backgroundColor: '#161927'
            }}
        >
            <ToastContainer
                className="p-3"
                position={'bottom-end'}
            >
                <Toast
                    show={show}
                    onClose={toggleShow}
                    animation={true}
                    autohide={true}
                    delay={3000}
                >
                    <Toast.Header>
                        <strong
                            className="me-auto"
                        >
                            Synchronizer
                        </strong>
                        <small>
                            agora
                        </small>
                    </Toast.Header>
                    <Toast.Body>{message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <ArrowsClockwise
                size={32}
                color={'#0d6efd'}
            />
            <center>
                <span
                    style={{
                        color: 'white'
                    }}>
                    Bem vindo!
                </span>
                <br />
                <h3
                    style={{
                        color: 'white'
                    }}>
                    Synchronizer
                </h3>
            </center>
            <Form
                className="container-fluid d-flex justify-content-center align-items-center flex-column gap-3"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >
                <Form.Group
                    as={Col}
                    controlId="validationCustom01"
                >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Email"
                    >
                        <Form.Control
                            required
                            type="email"
                            placeholder="Email"
                            style={{
                                width: '250px',
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group
                    as={Col}
                    controlId="validationCustom02"
                >
                    <FloatingLabel
                        controlId="floatingPassword"
                        label="Senha"
                    >
                        <Form.Control
                            required
                            type="password"
                            placeholder="Senha"
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '250px',
                            }}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Button
                    className='mt-4'
                    title="Entrar"
                    variant="primary"
                    type="submit"
                    size="lg"
                    isLoading={isLoading}
                />
            </Form>
            <Image
                src={'/assets/img/mtr-logo.png'}
                style={{
                    width: '80px',
                }}
            />
        </div>
    );
}