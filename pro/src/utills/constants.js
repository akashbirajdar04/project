export const UserRollEnum={
    ADMIN:"admin",
    PROJECT_ADMIN:'project_admin',
    MEMBER:"member"
}
export const TaskStatus=
{
    TODE:"todo",
    DONE:"done",
    In_Progress:"in_progrss"
}
export const AvailableUserRoll=Object.values(UserRollEnum)
export const AvailableTaskStatus=o=Object.values(TaskStatus);