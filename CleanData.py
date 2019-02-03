#!/usr/bin/env python
# coding: utf-8

# In[4]:


# ANOMALIES:
# df[df['DELIVERED_PRICE'] == min(df['DELIVERED_PRICE'])]
import pandas as pd
from keras.utils import to_categorical
import numpy as np

dict_swap = {'GFS_CAN_EDM': 'GFS', 'GFS_CAN_CAL':'GFS', 'MAINES_1-BRINKER': 'MAINES', 'MAINES_2-BRINKER': 'MAINES'}
orgz = {'FRESHPOINT': 0, 'MAINES': 1, 'SYSCO':2, 'MBM':3, 'WASSER':4, 'GFS':5, 'YHATA':6, 'FSA_SSA':7, 'SIGNATURE':8}

def swap_orgs(row):
    if row['GROUPED_ORG'] in dict_swap:
        return dict_swap[row['GROUPED_ORG']]
    else:
        return row['GROUPED_ORG']
    
def swap_accs(row):
    if 'CHILI\'S' in row['GROUPED_ACC']:# row['GROUPED_ACC'].contains('CHILI\'S'):
        return 0 # 'CHILIS'
    elif 'CHI' in row['GROUPED_ACC']:# row['GROUPED_ACC'].contains('CHI'):
        return 0 # 'CHILIS'
    elif 'MAGGIANO' in row['GROUPED_ACC']: # row['GROUPED_ACC'].contains('MAGGIANO\'S'):
        return 1 # 'MAGGIANOS'
    elif 'INTL' in row['GROUPED_ACC']:# row['GROUPED_ACC'].contains('INTL'):
        return 2 # 'INTL'
    else:
        return 3 # 'MISC'
    
def swap_orgs(row):
    return orgz[row['finals']]


from dateutil import parser
def date_to_day_num(val):
    text_day = parser.parse(val['TRANSACTION_DATE']).strftime('%A')
    if text_day == 'Monday':
        return 0
    elif text_day == 'Tuesday':
        return 1
    elif text_day == 'Wednesday':
        return 2
    elif text_day == 'Thursday':
        return 3
    elif text_day == 'Friday':
        return 4
    elif text_day == 'Saturday':
        return 5
    elif text_day == 'Sunday':
        return 6

import re 
def strip_extra_description(row):
    no_dash = row['PROC_NAME'].replace('-',' ')
    temp = re.split(r'[0-9]', no_dash)[0]
    less = temp.strip('/#')
    even_less = re.split(r'\*l*', less)[0]
    return even_less


numerical_vals = {}
def take_first(data):
    for desc in data['PROC_NAME'].split(' '):
        if desc in list(top15['Name'].values):
            return numerical_vals[desc]
    return 25

def everything_lol(df):
    df_dropped = df

    upper_limit = df_dropped['UNIT_PRICE'].quantile(0.999)
    df_dropped = df_dropped[(df_dropped['UNIT_PRICE'] < upper_limit) & (df_dropped['UNIT_PRICE'] > 0)] # drop outliers

    upper_limit = df_dropped['DELIVERED_PRICE'].quantile(0.999)
    df_dropped = df_dropped[(df_dropped['DELIVERED_PRICE'] < upper_limit) & (df_dropped['DELIVERED_PRICE'] > 0)]

    upper_limit = df_dropped['DELIVERED_QUANTITY'].quantile(0.999)
    df_dropped = df_dropped[(df_dropped['DELIVERED_QUANTITY'] < upper_limit) & (df_dropped['DELIVERED_QUANTITY'] > 0)]

    dropped_vals = df_dropped 

    # Creates Normalized Attributes
    dropped_vals['NORM_UNI_PRICE'] = (2 * ((dropped_vals['UNIT_PRICE'] - min(dropped_vals['UNIT_PRICE'])) / (max(dropped_vals['UNIT_PRICE']) - min(dropped_vals['UNIT_PRICE'])))) - 1

    dropped_vals['NORM_DEL_PRICE'] = (2 * ((dropped_vals['DELIVERED_PRICE'] - min(dropped_vals['DELIVERED_PRICE'])) / (max(dropped_vals['DELIVERED_PRICE']) - min(dropped_vals['DELIVERED_PRICE'])))) - 1

    dropped_vals['NORM_DEL_QUANT'] = (2 * ((dropped_vals['DELIVERED_QUANTITY'] - min(dropped_vals['DELIVERED_QUANTITY'])) / (max(dropped_vals['DELIVERED_QUANTITY']) - min(dropped_vals['DELIVERED_QUANTITY'])))) - 1

    # Grouping Orgs
    dropped_vals['GROUPED_ORG'] = dropped_vals['ORGANIZATION NUMBER'].str.strip('0123456789-_')
    dropped_vals['finals'] = dropped_vals.apply(swap_orgs, axis=1)
    dropped_vals['fin_org_num'] = dropped_vals.apply(swap_orgs, axis=1)
    onehotting5 = to_categorical(dropped_vals['fin_org_num'].values[:,np.newaxis]).tolist()

    
    # Group Account_Name
    dropped_vals['GROUPED_ACC'] = dropped_vals['ACCOUNT_NAME'].str.strip('#0123456789-_/')
    dropped_vals['final_acc'] = dropped_vals.apply(swap_accs, axis=1)
    beans5 = to_categorical(dropped_vals['final_acc'].values[:,np.newaxis]).tolist()
    
    
    # Date Data
    dropped_vals['DAY_VAL'] = dropped_vals.apply(date_to_day_num, axis=1)
    hot_date = to_categorical(dropped_vals['DAY_VAL'].values[:,np.newaxis]).tolist()
    
    # Making NumPy Array
    norm_array = dropped_vals[['NORM_UNI_PRICE','NORM_DEL_PRICE','NORM_DEL_QUANT']]
    stacked_acc = np.hstack((norm_array.values, beans5))
    together = np.hstack((stacked_acc, onehotting5))
    with_date = np.hstack((together, hot_date))
    
    # Save np array
    np.save('with_date.npy', with_date)
    
    
    ## ITEM DESCRIPTION WORK
    dropped_vals['PROC_NAME'] = dropped_vals['DC_PROD_NAME'].str.lower()#strip('0123456789-_')
    dropped_vals['PROC_NAME'] = dropped_vals.apply(strip_extra_description, axis=1)

    # Bucket Desc

    itemCount = {}
    for value in list(dropped_vals['PROC_NAME']):
        for desc in value.split(' '):
            if desc in itemCount:
                itemCount[desc] += 1
            else:
                itemCount[desc] = 1
                
    
    # Drop predefined useless descriptions
    itemCount.pop('', None)
    itemCount.pop('br', None)
    itemCount.pop('ct', None)
    itemCount.pop('chpd', None)
    itemCount.pop('chop', None)
    itemCount.pop('fx', None)
    itemCount.pop('ct.', None)
    itemCount.pop('cafe', None)
    itemCount.pop('red', None)
    itemCount.pop('yellow', None)
    itemCount.pop('green', None)
    itemCount.pop('gold', None)
    itemCount.pop('spring',None)
    itemCount.pop('iceberg', None)
    itemCount.pop('florets', None)
    itemCount.pop('loose', None)
    itemCount.pop('scooped', None)
    itemCount.pop('iceless', None)

    
    foodDf = pd.DataFrame({'Name':list(itemCount.keys()), 'Count':list(itemCount.values())})
    top15 = foodDf.sort_values(ascending=False, by='Count').iloc[:25]

    numerical_vals = dict((k, v) for (k,v) in zip(top15['Name'].values, np.arange(0,25)))

    dropped_vals['MIN_NAME'] = dropped_vals.apply(take_first, axis=1)
    hot_names = to_categorical(dropped_vals['MIN_NAME'].values[:,np.newaxis]).tolist()


    bucket_names = np.hstack((with_date, hot_names))
    
    np.save('hot_names.npy', bucket_names)


