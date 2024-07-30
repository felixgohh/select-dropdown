import React from 'react';
import '../index.css';
import SelectDropdown from '../components/SelectDropdown';
import jsonData from '../data/data.json';

export default {
  title: 'SelectDropdown',
  component: SelectDropdown,
};

const Template = (args) => <SelectDropdown {...args} />;

export const Default = Template.bind({});
Default.args = {
  labelText: 'University',
  placeholder: 'Choose...',
  options: jsonData.universities,
  multiple: false,
  searchable: true,
  onChange: (selected) => console.log(selected),
};

export const MultipleSelect = Template.bind({});
MultipleSelect.args = {
  labelText: 'Skills',
  placeholder: 'Choose...',
  options: jsonData.tech_stacks,
  multiple: true,
  searchable: true,
  onChange: (selected) => console.log(selected),
};

export const WithoutSearch = Template.bind({});
WithoutSearch.args = {
  labelText: 'Gender',
  placeholder: 'Choose...',
  options: jsonData.gender,
  multiple: false,
  searchable: false,
  onChange: (selected) => console.log(selected),
};
