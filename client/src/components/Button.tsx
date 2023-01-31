import {
    Button as BtsButton,
    ButtonProps as BtsButtonProps,
    Spinner as BtsSpinner
} from 'react-bootstrap';

type ButtonProps = BtsButtonProps & {
    title?: string,
    isLoading?: boolean
}

export function Button({ title, isLoading, ...rest }: ButtonProps) {
    return (
        <BtsButton
            disabled={isLoading}
            style={{
                height: '60px',
                width: '250px',
                borderRadius: '5px',
                padding: '0px 28px 0px 28px',
            }}
            {...rest}
        >
            {isLoading ?
                <BtsSpinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
                :
                <span>
                    {title}
                </span>
            }
        </BtsButton>
    );
}