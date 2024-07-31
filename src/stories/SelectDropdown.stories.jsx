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
  id: 'university-select',
  labelText: 'University',
  placeholder: 'Choose...',
  options: jsonData.universities,
  multiple: false,
  searchable: true,
  outlined: true,
  onChange: (selected) => console.log(selected),
};

export const MultipleSelect = Template.bind({});
MultipleSelect.args = {
  labelText: 'Skills',
  id: 'skills-select',
  placeholder: 'Choose...',
  options: jsonData.tech_stacks,
  multiple: true,
  searchable: true,
  outlined: true,
  onChange: (selected) => console.log(selected),
};

export const WithoutSearch = Template.bind({});
WithoutSearch.args = {
  labelText: 'Gender',
  placeholder: 'Choose...',
  options: jsonData.gender,
  outlined: false,
  multiple: false,
  searchable: false,
  onChange: (selected) => console.log(selected),
};
