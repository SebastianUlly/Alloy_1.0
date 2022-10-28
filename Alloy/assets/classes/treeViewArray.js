import gql from 'graphql-tag'

export default async function permissionTree(apollo){
    let tree = [];
    const permissions = (await apollo.query({
        query: gql`
            query {
                getPermissionDirectory{
                    id
                    hierarchy
                }
            }
        `
    })).data.getPermissionDirectory[0].hierarchy;
    const permissionNames = (await apollo.query({
        query: gql`
            query {
                permissionFiles {
                    permissionId
                    description
                }
            }
        `
    })).data.permissionFiles;
    const firstLevelPermissions = permissions.filter(item => !item.parentId);
    for(let item of firstLevelPermissions){
        tree.push(generator(item, permissions, permissionNames))
    }
    return tree;
}
function generator(item, permissions, names, object = undefined ){
    if(!object){
        object = {
            id: item.permissionId,
            name: names.find(itemName => itemName.permissionId == item.permissionId)?.description,
        }
    }
    const children = permissions.filter(perm => perm.parentId == item.permissionId)
    if(children.length){
        object.children = [];
        for(let child of children){
            object.children.push(generator(child, permissions, names));
        }
    }
    return object;
}