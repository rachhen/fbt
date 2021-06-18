import React, { FC, useState } from 'react';
import { Box, HStack } from '@chakra-ui/layout';
import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Select,
} from '@chakra-ui/react';

import { getData } from '../utils/storage';
import { getAdAccount } from '../services/account';
import { AdAccount, Account } from '../types';

type PostAccountProps = {
  onAccountChange: (account: Account) => void;
  onAdAccountChange: (adAccount: AdAccount) => void;
};

const PostAccount: FC<PostAccountProps> = ({
  onAccountChange,
  onAdAccountChange,
}) => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const accounts = getData('accounts');

  const onChange = async (id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    setError(null);
    onAccountChange(account);
    onAdAccountChange(undefined);
    if (!account) return setAdAccounts([]);
    try {
      setLoading(true);
      const adAccounts = await getAdAccount(id, account.accessToken);

      if (adAccounts) {
        setAdAccounts(adAccounts);
      }

      setLoading(false);
    } catch (err) {
      setError(err.toString());
    }
  };

  const adAccountChange = (id: string) => {
    const adAccount = adAccounts.find((adAcc) => adAcc.id === id);
    onAdAccountChange(adAccount);
  };

  return (
    <Box pt="5">
      {!!error && (
        <Alert status="error" mb="5" variant="left-accent">
          <AlertIcon />
          {error}
        </Alert>
      )}
      <HStack>
        <FormControl id="account">
          <FormLabel>Choose an account</FormLabel>
          <Select
            placeholder="Select account"
            onChange={(e) => onChange(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl
          id="adaccount"
          isDisabled={adAccounts.length === 0 || loading}
        >
          <FormLabel>Choose an adAccount</FormLabel>
          <Select
            placeholder="Select adAccount"
            onChange={(e) => adAccountChange(e.target.value)}
          >
            {adAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.id}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>
    </Box>
  );
};

export default PostAccount;
