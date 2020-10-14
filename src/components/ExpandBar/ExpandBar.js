import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import HintBox from '../HintBox';
import './ExpandBar.scss';


class ExpandBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,

        }

        this.handleOnClickAngle = this.handleOnClickAngle.bind(this);
    }

    handleOnClickAngle() {
        this.setState(prevState => ({
            showDetail: !prevState.showDetail,
        }))
        console.log(this.state.showDetail);
    }


    render() {
        const { showDetail } = this.state;
        const { showAdd, disabled, hintMessage } = this.props;
        let angleIconClassName = 'angleIcon '


        let expandContentClassName = 'expandBar__container__content '
        let addBtnClassName = 'expandBar__container__right__addBtn '
        if (showDetail) {
            angleIconClassName += 'angleIcon__rotate';
            expandContentClassName += 'expandBar__container__content__active';
        }

        if (disabled) {
            addBtnClassName += "expandBar__container__right__addBtn--disable";
        }

        return (
            <div className='expandBar'>
                <div className='expandBar__container'>
                    <div className="expandBar__container__labelBtn" onClick={this.handleOnClickAngle}>
                        <div className='expandBar__container__labelBtn__icon'>
                            <FontAwesomeIcon className={angleIconClassName} icon={faAngleRight} />
                        </div>
                        <div className='expandBar__container__labelBtn__text'>
                            <span> {this.props.label} </span>
                        </div>
                        {showAdd ?
                            <div className='expandBar__container__right'>
                                {disabled ?
                                    <div className='expandBar__container__right__hint'>
                                        <HintBox variant="right">
                                            {hintMessage}
                                        </HintBox>
                                    </div>
                                    :
                                    ""
                                }
                                <button className={addBtnClassName}
                                    disabled={disabled}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}>
                                    +Add
                                </button>
                            </div>
                            :
                            ""
                        }
                    </div>
                    <div className={expandContentClassName}>
                        {this.props.content}
                    </div>
                </div>

            </div>
        )
    }
}


export default ExpandBar