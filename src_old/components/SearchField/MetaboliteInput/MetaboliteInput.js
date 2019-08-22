import React from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';

const MetaboliteInput = () => {
  return (
    <FormGroup
      helperText="Type the name of the metabolite"
      label="Metabolite"
      labelFor="text-input"
      labelInfo="(required)"
    >
      <InputGroup id="metabolite-input" placeholder="ATP" />
    </FormGroup>
  );
};
export { MetaboliteInput };
