

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isSymmetric(root: TreeNode) -> bool:
    if not root:
        return True
    return isMirror(root.left, root.right)

def isMirror(left: TreeNode, right: TreeNode) -> bool:
    if not left and not right:
        return True
    if not left or not right:
        return False
    return left.val == right.val and isMirror(left.left, right.right) and isMirror(left.right, right.left)
