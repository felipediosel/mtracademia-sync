import { MinusCircle, PlusCircle } from 'phosphor-react';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';
import { Moment } from 'moment';

type TimePickerItemProps = TimePickerProps<Moment, Moment> & {
    type: 'plus' | 'minus';
    onClickPlus?: React.MouseEventHandler<SVGSVGElement> | undefined;
    onClickMinus?: React.MouseEventHandler<SVGSVGElement> | undefined;
}

export function TimePickerItem({ type, onClickPlus, onClickMinus, ...rest }: TimePickerItemProps) {
    return (
        <div
            className='d-flex justify-content-center align-items-center gap-2 mb-3'
        >
            <TimePicker
                ampm={false}
                label={`Horário`}
                {...rest}
            />
            {type === 'plus' ?
                <PlusCircle
                    className='m-3'
                    size={25}
                    color={'#28a745'}
                    onClick={onClickPlus}
                    style={{
                        cursor: 'pointer'
                    }}
                /> :
                <MinusCircle
                    className='m-3'
                    size={25}
                    color={'#dc3545'}
                    onClick={onClickMinus}
                    style={{
                        cursor: 'pointer'
                    }}
                />
            }
        </div>
    );
}