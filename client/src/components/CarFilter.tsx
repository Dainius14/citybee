import React from 'react';
import { Tree, Icon, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { UiState } from '../stores/uiState';
import { VehicleStore } from '../stores/vehicleStore';

const { TreeNode } = Tree;

interface IProps {
    uiState?: UiState,
    vehicleStore?: VehicleStore
}

@inject('uiState')
@inject('vehicleStore')
@observer
export default class CarFilter extends React.Component<IProps> {
    render() {
        const vehicleStore = this.props.vehicleStore!;
        const uiState = this.props.uiState!;
        return (
            <div>
                
                <Button type="link" onClick={() => uiState.checkAllCars()}>Check all</Button>
                <Button type="link" onClick={() => uiState.uncheckAllCars()}>Uncheck all</Button>
                <Tree checkable
                      checkedKeys={uiState.checkedCars}
                      onCheck={v => { uiState.updateCarFilter(v as Array<string>)}}
                      >
                    {Object.keys(vehicleStore.vehicleTree).sort().map(make => {
                        const models = vehicleStore.vehicleTree[make];

                        return (
                            <TreeNode title={make} key={make} icon={<CarIcon carMake={make}/>} selectable={false}>
                                {Object.keys(models).sort().map(model => {
                                    const item = models[model];

                                    return <TreeNode title={model} key={`${make}.${model}`}
                                            selectable={false}></TreeNode>;
                                })}
                            </TreeNode>
                        );
                    })}
                </Tree>
            </div>
        );
    }
}

function CarIcon({ carMake }: { carMake: string }) {
  const iconStyle = {
    fontSize: 20,
    width: 20,
    height: 20,
    marginRight: 6,
  }

  const makeCode = carMake.toLowerCase().replace(' ', '-');
  const carIconPath = '/car_icons/' + makeCode + '.png';

  if (!['alfa-romeo', 'bmw', 'fiat', 'ford', 'mini', 'toyota', 'vw'].includes(makeCode))
    return <Icon type="car" theme="twoTone" twoToneColor="#EF4B18" style={iconStyle}/>;
  else
    return <img src={carIconPath} style={iconStyle}></img>;
}