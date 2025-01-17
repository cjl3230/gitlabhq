import VueApollo from 'vue-apollo';
import Vue from 'vue';
import { GlLoadingIcon } from '@gitlab/ui';
import GroupsView from '~/organizations/shared/components/groups_view.vue';
import { formatGroups } from '~/organizations/shared/utils';
import resolvers from '~/organizations/shared/graphql/resolvers';
import GroupsList from '~/vue_shared/components/groups_list/groups_list.vue';
import { createAlert } from '~/alert';
import { shallowMountExtended } from 'helpers/vue_test_utils_helper';
import createMockApollo from 'helpers/mock_apollo_helper';
import waitForPromises from 'helpers/wait_for_promises';
import { organizationGroups } from '~/organizations/mock_data';

jest.mock('~/alert');

Vue.use(VueApollo);
jest.useFakeTimers();

describe('GroupsView', () => {
  let wrapper;
  let mockApollo;

  const createComponent = ({ mockResolvers = resolvers } = {}) => {
    mockApollo = createMockApollo([], mockResolvers);

    wrapper = shallowMountExtended(GroupsView, { apolloProvider: mockApollo });
  };

  afterEach(() => {
    mockApollo = null;
  });

  describe('when API call is loading', () => {
    beforeEach(() => {
      const mockResolvers = {
        Query: {
          organization: jest.fn().mockReturnValueOnce(new Promise(() => {})),
        },
      };

      createComponent({ mockResolvers });
    });

    it('renders loading icon', () => {
      expect(wrapper.findComponent(GlLoadingIcon).exists()).toBe(true);
    });
  });

  describe('when API call is successful', () => {
    beforeEach(() => {
      createComponent();
    });

    it('renders `GroupsList` component and passes correct props', async () => {
      jest.runAllTimers();
      await waitForPromises();

      expect(wrapper.findComponent(GroupsList).props()).toEqual({
        groups: formatGroups(organizationGroups.nodes),
        showGroupIcon: true,
      });
    });
  });

  describe('when API call is not successful', () => {
    const error = new Error();

    beforeEach(() => {
      const mockResolvers = {
        Query: {
          organization: jest.fn().mockRejectedValueOnce(error),
        },
      };

      createComponent({ mockResolvers });
    });

    it('displays error alert', async () => {
      await waitForPromises();

      expect(createAlert).toHaveBeenCalledWith({
        message: GroupsView.i18n.errorMessage,
        error,
        captureError: true,
      });
    });
  });
});
