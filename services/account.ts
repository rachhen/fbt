import { AdAccount } from '../types';
import api from './api';

export const getAdAccount = async (
  accountId: string,
  accessToken: string
): Promise<AdAccount[]> => {
  return api
    .get(`/${accountId}/adaccounts?access_token=${accessToken}`)
    .then(({ data }) => {
      return data.data.map((ad) => ({
        id: ad.id,
        account_id: ad.account_id,
      }));
    });
};

export const getAdVideos = async (
  adAccountId: string,
  accessToken: string,
  after = '',
  limit = 10
) => {
  try {
    const params = {
      access_token: accessToken,
      fields: 'source,picture',
      limit,
      after,
    };
    return await api
      .get(`/${adAccountId}/advideos`, { params })
      .then(({ data }) => data);
  } catch (err) {
    throw err;
  }
};
