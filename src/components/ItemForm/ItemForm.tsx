// imports from react and packages
import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button  } from '@mui/material'

// local imports
import { 
    chooseCategory,
    chooseItem,
    chooseDateDue,
    chooseDateReminder
} from '../../redux/slices/rootSlice';
import { Input } from '../sharedComponents/Input';
import { serverCalls } from '../../api';
import { useGetData } from '../../custom_hooks';


interface ItemFormProps {
    id?: string;
    data?: {};
}

interface ItemState {
    category: string;
    item: string;
    date_due: string;
    date_reminder: string;}

export const ItemForm = (props: ItemFormProps) => {
    const dispatch = useDispatch();
    let {itemData, getData} = useGetData();
    const store = useStore()
    const { register, handleSubmit } = useForm({})

    const onSubmit = async (data: any, event: any) => {
        console.log(props.id)

        if (props.id!) {
            await serverCalls.update(props.id!, data)
            console.log(`Updated: ${data} ${props.id}`)
            window.location.reload()
            event.target.reset();
        } else {
            dispatch(chooseCategory(data.category))
            dispatch(chooseItem(data.item))
            dispatch(chooseDateDue(data.date_due))
            dispatch(chooseDateReminder(data.date_reminder))
            await serverCalls.create(store.getState())
            window.location.reload()
        }
    }
    return (
        <div>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="category">Category</label>
                    <Input {...register('category')} name="category" placeholder='Category' />
                </div>
                <div>
                    <label htmlFor="item">Item</label>
                    <Input {...register('item')} name="item" placeholder="Item"/>
                </div>
                <div>
                    <label htmlFor="date_due">Due Date</label>
                    <Input {...register('date_due')} name="date_due" placeholder="Due Date"/>
                </div>
                <div>
                    <label htmlFor="date_reminder">Reminder Date</label>
                    <Input {...register('date_reminder')} name="date_reminder" placeholder="Reminder Date"/>
                </div>
                <Button type='submit'>Submit</Button>
            </form>
        </div>
    )
}



