import Spinner from 'react-bootstrap/Spinner';

export function Loading() {
    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center flex-column gap-5"
            style={{
                height: '100vh',
                backgroundColor: '#161927'
            }}
        >
            <Spinner
                animation="border"
                role="status"
                variant="primary"
            >
                <span
                    className="visually-hidden"
                >
                    Loading...
                </span>
            </Spinner>
        </div>
    );
}
