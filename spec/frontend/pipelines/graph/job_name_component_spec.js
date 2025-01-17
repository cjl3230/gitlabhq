import { mount } from '@vue/test-utils';
import jobNameComponent from '~/ci/pipeline_details/components/jobs_shared/job_name_component.vue';
import CiIcon from '~/vue_shared/components/ci_icon.vue';

describe('job name component', () => {
  let wrapper;

  const propsData = {
    name: 'foo',
    status: {
      icon: 'status_success',
      group: 'success',
    },
  };

  beforeEach(() => {
    wrapper = mount(jobNameComponent, {
      propsData,
    });
  });

  it('should render the provided name', () => {
    expect(wrapper.text()).toBe(propsData.name);
  });

  it('should render an icon with the provided status', () => {
    expect(wrapper.findComponent(CiIcon).exists()).toBe(true);
    expect(wrapper.find('.ci-status-icon-success').exists()).toBe(true);
  });
});
