

if __name__ == "__main__":
    print("Hello, World!")
    
    
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
        
        
def createNode(val):
    return TreeNode(val)
        
def insert(root, val):
    if root is None:
        return createNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inOrder(root):
    if root is not None:
        inOrder(root.left)
        print(root.val, end=" ")
        inOrder(root.right)

def main():
    root = None
    root = insert(root, 5)
    root = insert(root, 3)
    root = insert(root, 7)