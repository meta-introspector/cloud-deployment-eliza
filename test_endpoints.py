#!/usr/bin/python
import time
import requests
import boto3

def parse_command_id(send_command_output):
    return send_command_output['Command']['CommandId']

def main():
    ec2_client = boto3.client('ec2')
    ssm_client = boto3.client('ssm')

    # Get the list of instance IDs and their states
    instances_response = ec2_client.describe_instances()

    for reservation in instances_response['Reservations']:
            for instance in reservation['Instances']:
                state = instance['State']["Name"]
                instance_id = instance['InstanceId']
                if state == 'running':
                    ip = instance["PublicIpAddress"]
                    instance_type = instance["InstanceType"]
                    BASE_URL=f"http://{ip}:3000/"
                    target = f"{BASE_URL}/"
                    print(f"Starting command for instance: {instance_id} {target} {instance_type}")
                    try:
                        response = requests.get(target, timeout=8)                   
                        print(f"got response: {instance_id} {target} {instance_type} {response.text}")

                        target2 = f"{BASE_URL}/TINE-IntrospectorIsNotEliza/message"
                        response2 = requests.post(target2,data={"text":"how are you","userId":"test","userName":"user"}, timeout=80)
                        print(f"got response2: {instance_id} {target2} {instance_type} {response2.text} {response2.json()}")
                        print(f"got response2: {instance_id} {target2} {instance_type} {response2.text}" )
                    except Exception as exp:
                        print(f"got error: {instance_id} {target} {instance_type} {exp}")

                        #curl -d "{'text':'fsdfsd'}" http://18.190.253.117:3000

if __name__ == "__main__":
    main()
