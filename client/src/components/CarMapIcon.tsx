import React from 'react';
import { Icon, Popover } from 'antd';
import { Car } from '../types';
interface Props {
  car: Car;
  lat: number;
  lng: number;
  zoom: number;
}

export default class CarMapIcon extends React.Component<Props> {

  shouldComponentUpdate(nextProps: any) {
    return this.props.lat !== nextProps.lat || this.props.lng !== nextProps.lng;
  }

  componentWillUnmount() {

  }

  render() {
    return (
        <Popover title={<CarPopoverTitle car={this.props.car}/>}
                 content={<CarPopoverContent car={this.props.car}/>}>
          <div style={{ transform: 'translate(-50%, -50%)'}}>
            <CarIcon car={this.props.car}/>
          </div>
        </Popover>
    );
  }
}


function CarIcon({ car }: { car: Car }) {
  const iconStyle = {
    fontSize: 24,
    width: 24,
    height: 24,
    cursor: 'pointer',
  }

  const makeCode = car.details.make.toLowerCase().replace(' ', '-');
  const carIconPath = '/car_icons/' + makeCode + '.png';

  if (!['alfa-romeo', 'bmw', 'fiat', 'ford', 'mini', 'toyota', 'vw'].includes(makeCode))
    return <Icon type="car" theme="twoTone" twoToneColor="#EF4B18" style={iconStyle}/>
  else
    return <img src={carIconPath} style={iconStyle} className="car-appear"></img>
}

function CarPopoverTitle({ car }: { car: Car }) {
  const style = {};
  return <span style={style}>
    {car.details.make} {car.details.model}
  </span>;
}

function CarPopoverContent({ car }: { car: Car }) {
  return <div>
    <div><Icon type="environment" theme="twoTone" /> {car.address}</div>
    <div><Icon type="euro" theme="twoTone" /> {car.price + ' €/min'}</div>
    <img src={car.details.image_uri} style={{ height: 120, position: 'absolute', top: -115, left: 0 }}/>
  </div>;
}

