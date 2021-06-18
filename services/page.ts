import api from './api';

export const getPages = (accountId: string, accessToken: string) => {
  const params = {
    limit: 100,
    access_token: accessToken,
    fields: 'id,name,access_token',
  };

  try {
    return api
      .get(`/${accountId}/accounts`, { params })
      .then(({ data }) => data.data);
  } catch (err) {
    throw err;
  }
};

export const createCreative = async (adAccount: string, postData: any) => {
  try {
    return await api
      .post(`/${adAccount}/adcreatives`, postData)
      .then(({ data }) => data);
  } catch (err) {
    throw err;
  }
};

export const getCreativeInfo = async (
  creativeId: string,
  accessToken: string
) => {
  const paramsCreativeInfo = {
    access_token: accessToken,
    fields: 'effective_object_story_id',
  };

  try {
    return await api
      .get(`/${creativeId}`, { params: paramsCreativeInfo })
      .then(({ data }) => data);
  } catch (err) {
    throw err;
  }
};

export const publishCreative = async (
  effective_object_story_id: string,
  postData: any
) => {
  try {
    return await api
      .post(`/${effective_object_story_id}`, postData)
      .then(({ data }) => data);
  } catch (err) {
    throw err;
  }
};
