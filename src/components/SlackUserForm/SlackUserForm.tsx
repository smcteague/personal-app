// imports from react and packages
import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button  } from '@mui/material'

// local imports
import { 
    chooseSlackWorkspaceUrl,
    chooseSlackUserId
} from '../../redux/slices/rootSlice';
import { Input } from '../sharedComponents/Input';
import { serverCalls } from '../../api';
import { useGetData } from '../../custom_hooks';


interface SlackUserFormProps {
    id?: string;
    data?: {};
}

interface SlackUserState {
    slack_workspace_url: string;
    slack_user_id: string;
}

export const SlackUserForm = (props: SlackUserFormProps) => {
    const dispatch = useDispatch();
    // let {slackUserData, getData} = useGetData();
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
            dispatch(chooseSlackWorkspaceUrl(data.slack_workspace_url))
            dispatch(chooseSlackUserId(data.slack_user_id))
            await serverCalls.create_slack_user(store.getState())
            window.location.reload()
        }
    }
    return (
        <div>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="slack_workspace_url">Slack Workspace URL</label>
                    <Input {...register('slack_workspace_url')} name="slack_workspace_url" placeholder='Slack Workspace URL' />
                </div>
                <div>
                    <label htmlFor="slack_user_id">Slack User ID</label>
                    <Input {...register('slack_user_id')} name="slack_user_id" placeholder="Slack User ID"/>
                </div>
                <Button type='submit'>Submit</Button>
            </form>
        </div>
    )
}



