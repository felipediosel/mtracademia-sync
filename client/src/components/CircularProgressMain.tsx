import { Check, DeviceMobileCamera } from 'phosphor-react';
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { CircularProgressbarWithChildrenProps } from 'react-circular-progressbar/dist/CircularProgressbarWithChildren';

type CircularProgressMainProps = CircularProgressbarWithChildrenProps & {
    value: number,
    valueChildren: number
}

export function CircularProgressMain({ value, valueChildren, ...rest }: CircularProgressMainProps) {
    let isFinish = value === 100 && valueChildren === 100;
    let isStart = value === 0 && valueChildren === 0;

    return (
        <CircularProgressbarWithChildren
            value={value}
            strokeWidth={8}
            styles={
                buildStyles({
                    trailColor: "#cfe2ff",
                    pathColor: "#0d6efd"
                })
            }
        >
            <div
                style={{
                    width: "85%",
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {!!isFinish &&
                    <Check
                        size={32}
                        color={'#198754'}
                    />
                }
                {!!isStart &&
                    <DeviceMobileCamera
                        size={32}
                        color={'#0d6efd'}
                    />}
                {!isStart && !isFinish &&
                    <CircularProgressbar
                        value={valueChildren}
                        text={valueChildren !== 0 ? `${valueChildren}%` : ''}
                        strokeWidth={5}
                        styles={buildStyles({
                            pathColor: "#0d6efd",
                            trailColor: "transparent",
                            textSize: '10px',
                            textColor: "white",
                        })}
                    />
                }
            </div>
        </CircularProgressbarWithChildren>
    );
}