import * as DogHouseDiamondInfra from '../bin/dog_house_diamond_infra';

const synthedApp = DogHouseDiamondInfra.app.synth();

test('Stacks', () => {
    expect(synthedApp.stacks.map(x => x.stackName)).toMatchSnapshot();
});

synthedApp.stacks.forEach(stack => {
    test('Stack - ' + stack.stackName, () => {
        expect(stack.template).toMatchSnapshot();
    });
});